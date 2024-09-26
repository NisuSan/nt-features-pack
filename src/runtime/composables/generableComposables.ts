
    import * as twConfig from '../tailwindcss/tailwind.config.ts'
    import {type ComputedRef } from 'vue'

    type AppColors = {'light-background': string,
'light-card-background': string,
'light-input-background': string,
'light-text': string,
'light-main-brand': string,
'light-main-brand-hover': string,
'light-light-shades': string,
'light-light-accent': string,
'light-light-accent-hover': string,
'light-dark-accent': string,
'light-dark-accent-hover': string,
'light-dark-shades': string,
'light-default': string,
'light-success': string,
'light-success-hover': string,
'light-warning': string,
'light-warning-hover': string,
'light-danger': string,
'light-danger-hover': string,
'light-info': string,
'light-info-hover': string,
'light-border': string,
'light-disabled-background': string,
'light-disabled-text': string,
'light-disabled-border': string,
'light-placeholder': string,
'light-placeholder-disabled': string,
'dark-background': string,
'dark-card-background': string,
'dark-input-background': string,
'dark-text': string,
'dark-card-text': string,
'dark-main-brand': string,
'dark-main-brand-hover': string,
'dark-light-shades': string,
'dark-light-accent': string,
'dark-light-accent-hover': string,
'dark-dark-accent': string,
'dark-dark-accent-hover': string,
'dark-default': string,
'dark-success': string,
'dark-success-hover': string,
'dark-warning': string,
'dark-warning-hover': string,
'dark-danger': string,
'dark-danger-hover': string,
'dark-info': string,
'dark-info-hover': string,
'dark-border': string,
'dark-disabled-background': string,
'dark-disabled-text': string,
'dark-disabled-border': string,
'dark-placeholder': string,
'dark-placeholder-disabled': string}

    export function useAppColors(): AppColors {
      return twConfig.default.theme?.extend?.colors as AppColors
    }

    export function useColorChosers(themeName: ComputedRef<string>) {
      // @ts-ignore
      return (light: string, dark: string): string => ({light, dark}[themeName.value])
    }

    export function useThemeNames() {
      return ["light","dark"] as const
    }
  