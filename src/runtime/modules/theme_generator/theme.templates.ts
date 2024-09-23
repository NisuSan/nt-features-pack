import { addTypeTemplate, useNuxt } from '@nuxt/kit'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { ObjectLiteralExpression, Project, SyntaxKind } from 'ts-morph'
import { type ComputedRef, computed } from 'vue'
import { type GlobalThemeOverrides } from 'naive-ui'
import { createFile } from '../../utils/index.ts'
import { useColorChosers } from '../../composables/useColorChosers.ts'

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

export const themeMixins = `
@use "sass:map";

@function str-split($string, $separator) {
  $i: str-index($string, $separator);
  @if $i != null {
    @return append(
      str-slice($string, 1, $i - 1),
      str-split(str-slice($string, $i + str-length($separator)), $separator)
    );
  }
  @return $string
}

@mixin themed($selector: '', $theme: null) {
  $themes: (light, dark);

  @if $theme == null {
    @each $th in $themes {
      @each $s in str-split($selector, ',') {
        [theme=#{$th}] #{$s} {
          @content;
        }
      }
    }
  }
  @else {
    @each $s in str-split($selector, ',') {
      [theme=#{$theme}] #{$s} {
        @content;
      }
    }
  }
}

@mixin light() {
  [theme=light] & {
    @content;
  }
}

@mixin dark() {
  [theme=dark] & {
    @content;
  }
}
`

export const themeNaiveUi = `
@include themed('', 'light') {
  background-color: theme('colors.light-background') !important;
  color: theme('colors.light-text') !important;
}

@include themed('', 'dark') {
  background-color: theme('colors.dark-background') !important;
  color: theme('colors.dark-text') !important;
}

@include themed('.n-button.n-button--tertiary-type', 'light') {
  .n-button__border {
    border: 1px solid #E0E0E0 !important;
  }

  .n-button__state-border {
    border: none !important;
  }

  &:not(.n-button--disabled):hover {
    background: #E0E0E0 !important;
    .n-button__state-border {
      border: none !important;
    }
  }
}

@include themed('.n-button.n-button--tertiary-type .n-button__border', 'dark') {
  border: 1px solid transparent !important;
}

@include themed('.n-base-selection:not(.n-base-selection--disabled) .n-base-selection-label, .n-input:not(.n-input--disabled)', 'dark') {
  background-color: theme('colors.dark-input-background') !important;
}

@include themed('.n-base-selection:not(.n-base-selection--disabled) .n-base-selection-placeholder, .n-input:not(.n-input--disabled) .n-input__placeholder', 'dark') {
  color: theme('colors.dark-card-text') !important;
}

@include themed('.n-card', 'light') {
  box-shadow: theme('boxShadow.harder') !important;
}

.n-collapse-item__header--active .n-collapse-item__header-main {
  font-weight: 500 !important;

  @include light() {
    color: theme('colors.light-main-brand') !important;
  }

  @include dark() {
    color: theme('colors.dark-light-accent') !important;
  }
}

.n-base-selection.n-base-selection--disabled {
  border: none !important;

  * {
    border: none !important;
  }
}

$buttons: ('default': 'main-brand', 'primary': 'main-brand', 'info': 'info', 'success': 'success', 'warning': 'warning', 'error': 'danger');
@each $t in ('light', 'dark') {
  @each $btn, $n in $buttons {
    [theme=#{$t}] .n-button.n-button--#{$btn}-type.n-button--dashed:active {
      color: theme('colors.#{$t}-#{$n}-hover') !important;
      background-color: if($t == 'light', rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.05)) !important;

      .n-button__state-border {
        border-width: 1px !important;
      }
    }
  }
}
`

export const themeVanillaCss = ``

export const tailwindFileContent = `
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
`
export function injectColorsToTailwind() {
  const colors = require(resolve(useNuxt().options.buildDir, 'autogenerated/client/theme/theme.colors.ts'))
  const sourceFile = new Project().addSourceFileAtPath('src/runtime/tailwindcss/tailwind.config.ts')
  const themeInitializer = (sourceFile.getFirstDescendantByKind(SyntaxKind.ObjectLiteralExpression)?.getProperty('theme') as any)?.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression) as ObjectLiteralExpression
  const extendInitializer = (themeInitializer.getPropertyOrThrow('extend') as any)?.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression) as ObjectLiteralExpression
  extendInitializer.getProperty('colors')?.remove()
  extendInitializer?.addPropertyAssignment({ name: 'colors', initializer: JSON.stringify(colors) })
  sourceFile.saveSync()
}

export function createTypeForAppColors() {
  const colors = require(resolve(useNuxt().options.buildDir, 'autogenerated/client/theme/theme.colors.ts'))
  const defenitions = `export {}
    declare global {
      type AppColors = {${Object.keys(colors).map(k => `'${k}': string`).join(',\n')}}
    }
  `
  createFile(resolve('./src/types/colors.d.ts'), defenitions)
  addTypeTemplate({ filename: 'types/nt-features-pack-colors.d.ts', getContents: () => defenitions })
}

export function generateColorChosers() {
  const themes = [...new Set(Object.keys(require(resolve(useNuxt().options.buildDir, 'autogenerated/client/theme/theme.colors.ts'))).map(x => x.split('-')[0]))]
  const content = `
    import {type ComputedRef } from 'vue'
    export function useColorChosers(themeName: ComputedRef<string>) {
      // @ts-expect-error
      return (${themes.map(t => `${t}: string`).join(', ')}): string => ({${themes.join(', ')}}[themeName.value])
    }
  `
  createFile(resolve('./src/runtime/composables/useColorChosers.ts'), content)
}

export function generateUseThemeCodeComposable(sourceFileAndFunc?: `${string} => ${string}`) {
  if(!sourceFileAndFunc) return
  const [ file, func ] = sourceFileAndFunc.split(' => ').filter(x => x && typeof x === 'string' && x.length > 0)
  if(!file || !func) return

  const sourceFile = new Project().addSourceFileAtPath(resolve(useNuxt().options.rootDir, file))
  const naiveUiOverrides = sourceFile.getFunction(func)?.getFullText()?.replace(func, 'useThemeCode')

  const targetFile = resolve(useNuxt().options.rootDir, './composables/useThemeCode.ts')
  if(!naiveUiOverrides || existsSync(targetFile)) return

  createFile(targetFile, naiveUiOverrides)
}

export function naiveUiOverrides(appColors: Record<string, string>, themeName: ComputedRef<string>) {
  const ld = useColorChosers(themeName)
  const buttonColorMap = (prop: string) => [prop, appColors[`${themeName.value}-text`]]

  const createPressedColors = () => {
    const kind = ['Primary', 'Info', 'Success', 'Warning'] as const
    return Object.fromEntries(['color', 'border'].map(p => kind.map(k => [`${p}Pressed${k}`, appColors[`${themeName.value}-${k === 'Primary' ? 'main-brand' : k.toLowerCase()}-hover`]])).flat())
  }

  return computed<GlobalThemeOverrides>(() => ({
    common: {
      textColor2: ld(appColors['light-text'], appColors['dark-card-text']),
      textColor3: ld(appColors['light-text'], appColors['dark-card-text']),
      baseColor: appColors[`${themeName.value}-background`],
      primaryColor: appColors[`${themeName.value}-main-brand`],
      primaryColorHover: appColors[`${themeName.value}-main-brand-hover`],
      primaryColorSuppl: appColors[`${themeName.value}-main-brand-hover`],
      infoColor: appColors[`${themeName.value}-info`],
      infoColorHover: appColors[`${themeName.value}-info-hover`],
      successColor: appColors[`${themeName.value}-success`],
      successColorHover: appColors[`${themeName.value}-success-hover`],
      warningColor: appColors[`${themeName.value}-warning`],
      warningColorHover: appColors[`${themeName.value}-warning-hover`],
      errorColor: appColors[`${themeName.value}-danger`],
      errorColorHover: appColors[`${themeName.value}-danger-hover`],
      textColorBase: appColors[`${themeName.value}-text`],
      placeholderColor: appColors[`${themeName.value}-placeholder`],
      placeholderColorDisabled: appColors[`${themeName.value}-placeholder-disabled`],
      textColorDisabled: appColors[`${themeName.value}-disabled-text`],
      inputColorDisabled: appColors[`${themeName.value}-disabled-background`],
      borderColor: appColors[`${themeName.value}-border`],
      dividerColor: appColors[`${themeName.value}-border`],
      inputColor: appColors[`${themeName.value}-background`],
      tableColor: appColors[`${themeName.value}-background`],
      cardColor: appColors[`${themeName.value}-background`],
      modalColor: appColors[`${themeName.value}-background`],
      bodyColor: appColors[`${themeName.value}-background`],
      popoverColor: appColors[`${themeName.value}-background`],
      tagColor: appColors[`${themeName.value}-border`],
      hoverColor: appColors[`${themeName.value}-main-brand`],
      opacityDisabled: '0.5',
      boxShadow1: '0 1px 2px rgba(0, 0, 0, .08)',
      boxShadow2: '0 3px 6px rgba(0, 0, 0, .12)',
    },
    Button: {
      ...Object.fromEntries(['textColorPrimary', 'textColorInfo', 'textColorSuccess', 'textColorWarning', 'textColorError'].map(buttonColorMap)),
      ...Object.fromEntries(['textColorHoverPrimary', 'textColorHoverInfo', 'textColorHoverSuccess', 'textColorHoverWarning', 'textColorHoverError'].map(buttonColorMap)),
      color: ld(appColors['light-background'], appColors['dark-card-background']),
      colorHover: ld(appColors['light-background'], appColors['dark-card-background']),
      textColor: ld(appColors[`light-text`], appColors[`dark-card-text`]),
      textColorHover: ld(appColors[`light-main-brand-hover`], appColors[`dark-card-text`]),
      colorTertiary: ld('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)'),
      textColorTertiary: ld(appColors[`light-main-brand`], appColors[`dark-accent`]),
      textColorTertiaryHover: ld(appColors[`light-main-brand`], appColors[`dark-accent`]),
      textColorPressed: ld(appColors[`light-main-brand`], appColors[`dark-light-accent`]),
      colorPressed: ld('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)'),
      border: '1px solid ' + appColors[`${themeName.value}-border`],
      ...createPressedColors(),
      borderPressed: '1px solid ' + appColors[`${themeName.value}-main-brand`],
      colorPressedError: appColors[`${themeName.value}-danger-hover`],
      borderPressedError: appColors[`${themeName.value}-danger-hover`],
    },
    Card: {
      color: ld('transparent', appColors['dark-card-background']),
      borderColor: 'none',
      paddingMedium: '10px',
      borderRadius: '5px',
      titleFontSizeMedium: '1rem',
      titleTextColor: appColors[`${themeName.value}-text`], //themeName.value == 'light' ? appColors['light-text'] : appColors['dark-card-text'],
    },
    Checkbox: {
      checkMarkColor: appColors[`${themeName.value}-text`],
    },
    Switch: {
      railColor: ld('rgba(0, 0, 0, .14)',  appColors[`dark-border`]),
    },
    Collapse: {
      arrowColor: ld(appColors[`light-main-brand`], appColors[`dark-light-accent`]),
      titleTextColor: appColors[`${themeName.value}-text`], //themeName.value == 'light' ? appColors['light-text'] : appColors[`dark-card-text`],
      dividerColor: appColors[`${themeName.value}-light-accent`] + (themeName.value == 'light' ? 40 : 45),
      itemMargin: '10px 0 0 0',
      titlePadding: '10px 0 0 0',
    },
    DatePicker: {
      calendarTitleColorHover: ld('rgba(0, 0, 0, 0.05)', 'rgba(255, 255, 255, 0.05)'),
      calendarTitleTextColor: appColors[`${themeName.value}-main-brand`],
    },
    Tabs: {
      tabFontWeightActive: '500',
      tabTextColorLine: appColors[`${themeName.value}-text`], //themeName.value == 'light' ? appColors['light-text'] : appColors[`dark-card-text`]
    }
  }))
}
