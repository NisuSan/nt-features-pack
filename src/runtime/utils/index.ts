import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname } from 'node:path'
import { rimrafSync } from 'rimraf'
import { gray, greenBright, redBright, yellowBright, blueBright } from 'ansis'

export function createFile(path: string, content: string) {
  const dirs = dirname(path)
  if(!existsSync(dirs)) mkdirSync(dirs, { recursive: true })

  rimrafSync(path)
  writeFileSync(path, content, { encoding: 'utf-8' })
}

export function capitalize(word: string) {
  return word?.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
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
