import { addServerHandler } from '@nuxt/kit'
import fg from 'fast-glob'
import { existsSync } from 'node:fs'
import { Project } from 'ts-morph'
import { createFile, getRuntimeApiDir, getUrlRouteFromFile, resolve } from '../../utils/index.ts'

export const defaultColorShema = {
  light: {
    background: '#F3F1F2',
    'card-background': 'transparent',
    'input-background': 'transparent',
    'text': '#252538',
    'card-text': '#252538',
    'main-brand': '#6067B1',
    'main-brand-hover': '#4F5590',
    'light-shades': '#F3F1F2',
    'light-accent': '#8478B8',
    'light-accent-hover': '#6B5B9E',
    'dark-accent': '#AC4259',
    'dark-accent-hover': '#903548',
    'dark-shades': '#252538',
    'default': '#888888',
    'success': '#5d9966',
    'success-hover': '#4c8053',
    'warning': '#da892e',
    'warning-hover': '#b26e24',
    'danger': '#f44336',
    'danger-hover': '#c7352b',
    'info': '#7A6AAE',
    'info-hover': '#6B5B9E',
    'border': '#9E8ECB',
    'disabled-background': '#E0E0E0',
    'disabled-text': '#A0A0A0',
    'disabled-border': '#D1D1D1',
    'placeholder': '#B0B0B0',
    'placeholder-disabled': '#9d9d9d',
  },
  dark: {
    'background': '#1C1C1E',
    'card-background': '#2C2C2E',
    'input-background': '#3A3A3C',
    'text': '#F3F1F2',
    'card-text': '#d0c8cc',
    'main-brand': '#686CCF',
    'main-brand-hover': '#42477A',
    'light-shades': '#7A6AAE',
    'light-accent': '#A397E1',
    'light-accent-hover': '#42477A',
    'dark-accent': '#AC4259',
    'dark-accent-hover': '#903548',
    'dark-shades': '#1C1C1E',
    'default': '#707070',
    'success': '#5d9966',
    'success-hover': '#4c8053',
    'warning': '#da892e',
    'warning-hover': '#b26e24',
    'danger': '#f44336',
    'danger-hover': '#c7352b',
    'info': '#7A6AAE',
    'info-hover': '#6B5B9E',
    'border': '#6C6C6E',
    'disabled-background': '#2E2E30',
    'disabled-text': '#6C6C6E',
    'disabled-border': '#3D3D3F',
    'placeholder': '#7A7A7C',
    'placeholder-disabled': '#58585a',
  }
}

export const tailwindFileContent = `
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
`

export function buildCssColors(location: string) {
  return Object.keys(require(resolve(location, 'theme.colors.ts', 'src'))).map(theme => {
    //@ts-expect-error
    return `[theme='${theme}'] {\n` + Object.entries(defaultColorShema[theme]).map(([key, value]) => `  --${key}: ${value};`).join('\n') + '\n}'
  }).join('\n')
}

export function createGenerableComposables(location: string, [path, fn]: [string, string]) {
  const colors = require(resolve(location, 'theme.colors.ts', 'src'))
  const themes = Object.keys(colors)

  if(!existsSync(path)) throw new Error(`Path ${path} does not exist`)
  const file = new Project().addSourceFileAtPath(path)

  const themeFunction = file.getFunction(fn)
  if(!themeFunction) throw new Error(`Function ${fn} not found in ${path}`)

  if(findDiffKeys(Object.values(colors)).length > 0) throw new Error('Theme colors are not consistent!')

  createFile(resolve('../../composables/generableComposables.ts'), `
    import {type ComputedRef, isRef, computed } from 'vue'
    import { useColorMode } from '@vueuse/core'
    import { ${fn} } from '${path}'
    export type AppColors = {${Object.keys(colors[themes[0]]).map((k: string) => `'${k}': string`).join(',')}}

    export function useAppColors() {
      const colors = ${JSON.stringify(colors)}
      const theme = useColorMode()
      return {
        //@ts-expect-error
        currentColors: computed<AppColors>(x => colors[theme.value]),
        ${themes.map(t => `${t}: colors['${t}']`).join(', ')}
      }
    }

    export function useColorChooser() {
      const theme = useColorMode()
      const colors = useAppColors()
      return ((${themes.map(t => `${t}Color: keyof AppColors`).join(',')}) => computed<string>(() => {
        const l = {${themes.map(t => `'${t}': ${t}Color`).join(',')}}
        //@ts-expect-error
        return colors[theme.value][l[theme.value]] || l[theme.value]
      })) as {
        (${themes.map(t => `${t}Color: keyof AppColors`).join(',')}): ComputedRef<string>,
        (${themes.map(t => `${t}Color: string`).join(',')}): ComputedRef<string>,
      }
    }

    export function useThemeNames() {
      return ${JSON.stringify(themes)} as const
    }

    export function __useThemeCode(appColors: ComputedRef<AppColors>) {
      return ${fn}(appColors)
    }
  `)
}

export function generateRuntimeApiRoutes() {
  const moduleThemeApi = fg.sync([getRuntimeApiDir()], { dot: true })
  for (const apiPath of moduleThemeApi) {
    addServerHandler({ route: getUrlRouteFromFile(apiPath), handler: apiPath })
  }
}

function findDiffKeys(...objects: object[]): string[] {
  const diffKeys = new Set<string>()
  const allKeys = new Set<string>()

  for (const obj of objects) {
    for (const key in obj) {
      allKeys.add(key);
    }
  }

  for (const key of allKeys) {
    if (!objects.every(obj => key in obj)) {
      diffKeys.add(key)
    }
  }

  return Array.from(diffKeys)
}
