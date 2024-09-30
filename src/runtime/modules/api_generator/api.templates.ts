/* eslint-disable no-useless-escape */

import { parse } from 'node:path'
import { readFileSync } from 'node:fs'
import fg from 'fast-glob'
import { ExportAssignment, Project, SyntaxKind, type ArrowFunction } from 'ts-morph'
import { capitalize, getRuntimeApiDir, getUrlRouteFromFile, log, resolve } from '../../utils/index.ts'

const tsProject = new Project({ tsConfigFilePath: 'tsconfig.json' })

type CustomApiTypes = {
  file: string,
  args: string
  result: string
}

type Options = {
  includeFiles: string[],
  isThemeGeneratorActive: boolean,
  functionName: string
}

export function composableApiTemplate(options: Options) {
  const serverDir = resolve('server')
  const dirsForParse = [...options.includeFiles, process.env.NODE_ENV === 'development' && options.isThemeGeneratorActive ? getRuntimeApiDir() : []].flat()

  const customApis = fg.sync(dirsForParse.map(x => x.replace('<serverDir>', serverDir)), { dot: true })
  const customTypes = customApis.map(x => extractCustomApiTypes(x))

  log(customApis.length == 0 ? 'No APIs found' : `Processing ${customApis.length} APIs`, 'default')

  let compiledInputTypes = customTypes.map(x => x.args).join(':')
  compiledInputTypes = compiledInputTypes + (compiledInputTypes ? ': never' : 'undefined')

  let compiledOutputTypes = customTypes.map(x => x.result).join(':')
  compiledOutputTypes = compiledOutputTypes + (compiledOutputTypes ? ': never' : 'undefined')

  let definedManualRoutes: string | string[] = customApis.map(x => `"${parse(x).name}"`)
  definedManualRoutes = definedManualRoutes.length > 0 ? definedManualRoutes.join(' | ') : 'undefined'

  const apiFunctions = Object.entries(customApis.map(x => {
    const parsed = parse(x)
    const group = parsed.dir.split('/').reverse()[0]
    const parts = parsed.name.split('.')
    const fnName = parts[1] ? `${parts[1]}${capitalize(parts[0])}` : parts[0]
    const route = getUrlRouteFromFile(x)

    return {
      group,
      method: `
        // @ts-expect-error
        ${fnName}<T = '${group}.${parsed.name}'>(params?: Ref<APIParams<T>> | APIParams<T>, options?: Omit<UseFetchOptions<APIOutput<T>>, 'default' | 'query' | 'body' | 'params'> & { default?: () => APIOutput<T> | Ref<APIOutput<T>>, withCache?: boolean | number }) {
          // @ts-expect-error
          return useExtendedFetch<APIOutput<T>>(\`${route}\`, '${parts[1] || 'get'}', params, options) as AsyncData<APIOutput<T>, Error>
        }
      `,
    }
  // @ts-ignore
  }).reduce((r, a) => ({ ...r, [a.group]: [...r[a.group] || [], a.method] }), {}))
  .map(([k, v]) => k == 'api' ? (v as string[]).join(',') : `
    ${k}: {
      ${(v as string[]).join(',')}
    }
  `)

  return `
    import {type Ref, unref, toRaw } from 'vue'
    export type Endpoint = ${definedManualRoutes};
    export type APIParams<T> = ${compiledInputTypes};
    export type APIOutput<T> = ${compiledOutputTypes};

    export function ${options.functionName}() {
      return {
        ${apiFunctions}
      }
    }

    export function useExtendedFetch<T>(
      url: string,
      method: string = 'get',
      params?: Ref<APIParams<T>> | APIParams<T>,
      // @ts-expect-error
      options?: Omit<UseFetchOptions<APIOutput<T>>, 'default' | 'query' | 'body' | 'params'> & { default?: () => APIOutput<T> | Ref<APIOutput<T>>, withCache?: boolean | number }
    ) {
      const isHasArray = Object.values(unref(params) || {}).some(value => Array.isArray(value))
      // @ts-expect-error
      return useFetch<APIOutput<T>>(url, {
        method,
        [['get', 'delete'].includes(method) ? 'query' : 'body']: isHasArray
          ? Object.fromEntries(Object.entries(unref(params) || {}).map(([k, v]) => [Array.isArray(v) ? \`\${k}[]\` : k, toRaw(v)]))
          : params,
        lazy: true,
        getCachedData: options?.withCache === true ? (key, nuxtApp) => {
          return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
        } : undefined,
        default: () => [],
        ...options }
      // @ts-expect-error
      )  as AsyncData<APIOutput<T>, Error>
    }
  `
}

function extractCustomApiTypes(file: string): CustomApiTypes {
  const content = readFileSync(file).toString('utf8')

  const matchArgs = content.match(/type\s?QueryArgs\s?=\s?({[^}]*}|[^{;\n]+)/)
  const argsType = matchArgs ? matchArgs[1].replaceAll('\r\n', '').replaceAll('{', '{ ').replaceAll('}', ' }').replaceAll(/ +/g, ' ') : '{}'

  const resultType = getResultTypeFromAPI(file) || '{}'
  const parsed = parse(file)
  const group = parsed.dir.split('/').reverse()[0]

  return {
    file,
    args: `T extends "${group}.${parsed.name}" ? ${argsType}`,
    result: `T extends "${group}.${parsed.name}" ? ${resultType}`
  }
}

function getResultTypeFromAPI(file: string): string | undefined {
  const sourceFile = tsProject.addSourceFileAtPath(file)

  const arrowFunction = sourceFile.getExportAssignment((exp: ExportAssignment) => {
    const expression = exp.getExpressionIfKind(SyntaxKind.CallExpression)
    if (!expression) return false

    const identifier = expression.getExpressionIfKind(SyntaxKind.Identifier)
    return identifier?.getText() === 'defineEventHandler'
  })?.getExpressionIfKind(SyntaxKind.CallExpression)?.getArguments()[0] as ArrowFunction

  if (!arrowFunction) return undefined
  const arrowFunctionSourceFile = arrowFunction.getSourceFile()

  return arrowFunction.getReturnType().getProperties()
    .filter(x => x.getName() === 'finally')
    .map(x => x.getTypeAtLocation(arrowFunctionSourceFile).getCallSignatures()[0].getReturnType().getTypeArguments()[0].getText())[0]
    .replaceAll(';', ',')
}
