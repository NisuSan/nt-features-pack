/* eslint-disable no-useless-escape */

import { parse } from 'node:path'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import fg from 'fast-glob'
import { ExportAssignment, Project, SyntaxKind, type ArrowFunction } from 'ts-morph'
import { useNuxt } from '@nuxt/kit'
import { capitalize, log } from '../../utils/index.ts'

const tsProject = new Project({ tsConfigFilePath: 'tsconfig.json' })

type CustomApiTypes = {
  file: string,
  args: string
  result: string
}

type Options = {
  includeFiles: string[]
}

export function composableApiTemplate(options: Options) {
  const serverDir = resolve(useNuxt().options.buildDir, '..', 'server').replace(/\\/g, '/')

  const customApis = fg.sync(options.includeFiles.map(x => x.replace('<serverDir>', serverDir)), { dot: true })
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

    return {
      group,
      method: `
        ${fnName}<T = '${group}.${parsed.name}'>(params?: Ref<APIParams<T>> | APIParams<T>, options?: Omit<UseFetchOptions<APIOutput<T>>, 'default' | 'query' | 'body' | 'params'> & { default?: () => APIOutput<T> | Ref<APIOutput<T>>, withCache?: boolean | number }) {
          return useExtendedFetch<APIOutput<T>>(\`/${parse(x).dir.split('/').slice(1).join('/')}/${parts[0]}\`, '${parts[1]}', params, options) as AsyncData<APIOutput<T>, Error>
        }
      `,
    }
  // @ts-expect-error
  }).reduce((r, a) => ({ ...r, [a.group]: [...r[a.group] || [], a.method] }), {}))
  .map(([k, v]) => k == 'api' ? (v as string[]).join(',') : `
    ${k}: {
      ${(v as string[]).join(',')}
    }
  `)

  return `
    /*
      Please note that the accompanying TypeScript file has been automatically generated and, therefore, any manual modifications may result in unexpected behavior.
      We strongly advise against making any edits to this file by hand, as it may lead to unintended consequences and potential errors.
      Thank you for your understanding and cooperation in this matter.
    */

    import type { AsyncData, UseFetchOptions } from '#app'
    export type Endpoint = ${definedManualRoutes};
    export type APIParams<T> = ${compiledInputTypes};
    export type APIOutput<T> = ${compiledOutputTypes};

    export function api() {
      return {
        ${apiFunctions}
      }
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
