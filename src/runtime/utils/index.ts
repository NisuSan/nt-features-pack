import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, isAbsolute, resolve as pathResolve } from 'node:path'
import { rimrafSync } from 'rimraf'
import { gray, greenBright, redBright, yellowBright, blueBright } from 'ansis'
import { useNuxt } from '@nuxt/kit'

export function createFile(path: string, content: string) {
  const dirs = dirname(path)
  if(!existsSync(dirs)) mkdirSync(dirs, { recursive: true })

  rimrafSync(path)
  writeFileSync(path, content, { encoding: 'utf-8' })
}

export function log(text: string, kind: 'default' | 'success' | 'error' | 'warning') {
  const kindToColor = {
    default: gray,
    success: greenBright,
    error: redBright,
    warning: yellowBright
  }

  console.log(kindToColor[kind](`  ${blueBright`[ApiGenerator]`}: ${text}\n`))
}

  /**
   * Resolves a path based on the given parameters.
   * If the last parameter is 'build' or 'server', it will be resolved relative to the buildDir.
   * Otherwise, it will be resolved relative to the current file.
   * You can also omit the last parameter, and it will be resolved relative to the current file.
   * @param {...string | 'build' | 'server'} paths - The paths to resolve
   * @returns {string} The resolved path
   */
export function resolve(...paths: [...string[], 'build' | 'server' | 'src' | string]): string {
  const isAbs = isAbsolute(paths[0])
  const isLiteral = ['build', 'server', 'src'].includes(paths[paths.length - 1])
  const buildDir = useNuxt().options.buildDir

  const literalToPath = {
    build: pathResolve(buildDir, './autogenerated'),
    server: pathResolve(buildDir,'../server'),
    src: pathResolve(buildDir,'../'),
  }[paths[paths.length - 1]] || getCallerDist()

  const p = (!isLiteral ? paths : paths.slice(0, -1)).map(x => x.startsWith('./') || x.startsWith('../') ? x : './' + x)
  return pathResolve(isAbs ? paths[0] : literalToPath, ...(isAbs ? p.slice(1) : p)).replace(/\\/g, '/')
}

export function getCallerDist() {
  const originalFunc = Error.prepareStackTrace
  let callerFile: string | undefined

  try {
    const err = new Error()
    Error.prepareStackTrace = (err, stack) => stack

    const stack = err.stack as unknown as NodeJS.CallSite[]
    const currentFile = stack[0]?.getFileName()

    callerFile = stack.find(site => site.getFileName() !== currentFile)?.getFileName()
  } catch (e) {
    console.error(e)
  } finally {
    Error.prepareStackTrace = originalFunc
  }

  return callerFile ? dirname(pathResolve(callerFile).replace(/\\/g, '/')) : ''
}

export function getRuntimeApiDir() {
  return pathResolve(useNuxt().options.rootDir, '../src/runtime/server/api/**/*.ts').replace(/\\/g, '/')
}

export function getUrlRouteFromFile(file: string) {
  const parsed = file.match(/\/server(.*?\/)([^\/]+?)(?:\.\w+)+$/)!
  return parsed[1] + (parsed[2] === 'index' ? '' : parsed[2])
}
