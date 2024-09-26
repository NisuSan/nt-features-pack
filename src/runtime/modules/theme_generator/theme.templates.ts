import { addPlugin, useNuxt } from '@nuxt/kit'
import { existsSync } from 'node:fs'
import { ObjectLiteralExpression, Project, SyntaxKind } from 'ts-morph'
import { createFile, resolve, resolveBuild } from '../../utils/index.ts'

export const defaultColorShema = {
  'light-background': '#F3F1F2',
  'light-card-background': 'transparent',
  'light-input-background': 'transparent',
  'light-text': '#252538',
  'light-main-brand': '#6067B1',
  'light-main-brand-hover': '#4F5590',
  'light-light-shades': '#F3F1F2',
  'light-light-accent': '#8478B8',
  'light-light-accent-hover': '#6B5B9E',
  'light-dark-accent': '#AC4259',
  'light-dark-accent-hover': '#903548',
  'light-dark-shades': '#252538',
  'light-default': '#888888',
  'light-success': '#5d9966',
  'light-success-hover': '#4c8053',
  'light-warning': '#da892e',
  'light-warning-hover': '#b26e24',
  'light-danger': '#f44336',
  'light-danger-hover': '#c7352b',
  'light-info': '#7A6AAE',
  'light-info-hover': '#6B5B9E',
  'light-border': '#9E8ECB',
  'light-disabled-background': '#E0E0E0',
  'light-disabled-text': '#A0A0A0',
  'light-disabled-border': '#D1D1D1',
  'light-placeholder': '#B0B0B0',
  'light-placeholder-disabled': '#9d9d9d',
  'dark-background': '#1C1C1E',
  'dark-card-background': '#2C2C2E',
  'dark-input-background': '#3A3A3C',
  'dark-text': '#F3F1F2',
  'dark-card-text': '#d0c8cc',
  'dark-main-brand': '#686CCF',
  'dark-main-brand-hover': '#42477A',
  'dark-light-shades': '#7A6AAE',
  'dark-light-accent': '#A397E1',
  'dark-light-accent-hover': '#42477A',
  'dark-dark-accent': '#AC4259',
  'dark-dark-accent-hover': '#903548',
  'dark-default': '#707070',
  'dark-success': '#5d9966',
  'dark-success-hover': '#4c8053',
  'dark-warning': '#da892e',
  'dark-warning-hover': '#b26e24',
  'dark-danger': '#f44336',
  'dark-danger-hover': '#c7352b',
  'dark-info': '#7A6AAE',
  'dark-info-hover': '#6B5B9E',
  'dark-border': '#6C6C6E',
  'dark-disabled-background': '#2E2E30',
  'dark-disabled-text': '#6C6C6E',
  'dark-disabled-border': '#3D3D3F',
  'dark-placeholder': '#7A7A7C',
  'dark-placeholder-disabled': '#58585a',
}

export const tailwindFileContent = `
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
`

export function injectColorsToTailwind(isInternal: boolean) {
  const colors = require(resolveBuild(isInternal ? 'autogenerated/client/theme/theme.colors.ts' : '../theme', 'root'))
  const sourceFile = new Project().addSourceFileAtPath(resolve('../../tailwindcss/tailwind.config.ts'))

  const themeInitializer = (sourceFile.getFirstDescendantByKind(SyntaxKind.ObjectLiteralExpression)?.getProperty('theme') as any)?.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression) as ObjectLiteralExpression
  const extendInitializer = (themeInitializer.getPropertyOrThrow('extend') as any)?.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression) as ObjectLiteralExpression

  extendInitializer.getProperty('colors')?.remove()
  extendInitializer?.addPropertyAssignment({ name: 'colors', initializer: JSON.stringify(colors) })
  sourceFile.saveSync()
}

export function createGenerableComposables() {
  const colorProps = Object.keys(require(resolve(useNuxt().options.buildDir, 'autogenerated/client/theme/theme.colors.ts')))
  const themes = [...new Set(colorProps.map(x => x.split('-')[0]))]

  createFile(resolve('../../composables/generableComposables.ts'), `
    import * as twConfig from '../tailwindcss/tailwind.config.ts'
    import {type ComputedRef } from 'vue'

    type AppColors = {${colorProps.map(k => `'${k}': string`).join(',\n')}}

    export function useAppColors(): AppColors {
      return twConfig.default.theme?.extend?.colors as AppColors
    }

    export function useColorChosers(themeName: ComputedRef<string>) {
      // @ts-ignore
      return (${themes.map(t => `${t}: string`).join(', ')}): string => ({${themes.join(', ')}}[themeName.value])
    }

    export function useThemeNames() {
      return ${JSON.stringify(themes)} as const
    }
  `)
}

export function optionProviderPluginGenerator(functionLike: `${string} => ${string}`) {
  const [pt, fn] = functionLike.split(' => ')

  const path = resolve(pt);
  if(!existsSync(path)) throw new Error(`Path ${path} does not exist`)

  const themeFunction = new Project().addSourceFileAtPath(path).getFunction(fn)
  if(!themeFunction) throw new Error(`Function ${fn} not found in ${pt}`)

  const destPath = resolve('../../plugins/optionProvider.ts')
  createFile(destPath, `
    import { type ComputedRef, computed } from 'vue'
    import { type GlobalThemeOverrides } from 'naive-ui'
    export default defineNuxtPlugin((nuxtApp) => ({ provide: { ntFeaturePack: { themeGenerator: { themeCode: (appColors: Record<string, string>, themeName: ComputedRef<string>) => { ${themeFunction.getBodyText()} } } } } }))
  `)

  addPlugin({ src: destPath, mode: 'client' })
}
