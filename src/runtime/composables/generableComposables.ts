
    import {type ComputedRef, isRef } from 'vue'

    type AppColors = {'background': string,'card-background': string,'input-background': string,'text': string,'card-text': string,'main-brand': string,'main-brand-hover': string,'light-shades': string,'light-accent': string,'light-accent-hover': string,'dark-accent': string,'dark-accent-hover': string,'dark-shades': string,'default': string,'success': string,'success-hover': string,'warning': string,'warning-hover': string,'danger': string,'danger-hover': string,'info': string,'info-hover': string,'border': string,'disabled-background': string,'disabled-text': string,'disabled-border': string,'placeholder': string,'placeholder-disabled': string}

    export function useAppColors(theme?: 'light'|'dark'): AppColors {
      const docStyles = getComputedStyle(document.querySelector(`[theme${theme ? `='${theme}'` : ''}]`)!)
      return {'background': docStyles.getPropertyValue('--background'),'card-background': docStyles.getPropertyValue('--card-background'),'input-background': docStyles.getPropertyValue('--input-background'),'text': docStyles.getPropertyValue('--text'),'card-text': docStyles.getPropertyValue('--card-text'),'main-brand': docStyles.getPropertyValue('--main-brand'),'main-brand-hover': docStyles.getPropertyValue('--main-brand-hover'),'light-shades': docStyles.getPropertyValue('--light-shades'),'light-accent': docStyles.getPropertyValue('--light-accent'),'light-accent-hover': docStyles.getPropertyValue('--light-accent-hover'),'dark-accent': docStyles.getPropertyValue('--dark-accent'),'dark-accent-hover': docStyles.getPropertyValue('--dark-accent-hover'),'dark-shades': docStyles.getPropertyValue('--dark-shades'),'default': docStyles.getPropertyValue('--default'),'success': docStyles.getPropertyValue('--success'),'success-hover': docStyles.getPropertyValue('--success-hover'),'warning': docStyles.getPropertyValue('--warning'),'warning-hover': docStyles.getPropertyValue('--warning-hover'),'danger': docStyles.getPropertyValue('--danger'),'danger-hover': docStyles.getPropertyValue('--danger-hover'),'info': docStyles.getPropertyValue('--info'),'info-hover': docStyles.getPropertyValue('--info-hover'),'border': docStyles.getPropertyValue('--border'),'disabled-background': docStyles.getPropertyValue('--disabled-background'),'disabled-text': docStyles.getPropertyValue('--disabled-text'),'disabled-border': docStyles.getPropertyValue('--disabled-border'),'placeholder': docStyles.getPropertyValue('--placeholder'),'placeholder-disabled': docStyles.getPropertyValue('--placeholder-disabled')} as AppColors
    }

    export function useColorChooser(themeName: ComputedRef<string> | string) {
      // @ts-ignore
      return (light: string, dark: string): string => ({light, dark}[isRef(themeName) ? themeName.value : value])
    }

    export function useThemeNames() {
      return ["light","dark"] as const
    }
  