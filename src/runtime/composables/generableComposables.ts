
    import {type ComputedRef, isRef, computed } from 'vue'
    import { useColorMode } from '@vueuse/core'
    import { naiveUiOverrides } from 'C:/repos/nt-features-pack/src/runtime/modules/theme_generator/source/naiveUiOverrides.ts'
    export type AppColors = {'background': string,'card-background': string,'input-background': string,'modal-background': string,'text': string,'card-text': string,'main-brand': string,'main-brand-hover': string,'light-shades': string,'light-accent': string,'light-accent-hover': string,'dark-accent': string,'dark-accent-hover': string,'dark-shades': string,'default': string,'success': string,'success-hover': string,'warning': string,'warning-hover': string,'danger': string,'danger-hover': string,'info': string,'info-hover': string,'border': string,'disabled-background': string,'disabled-text': string,'disabled-border': string,'placeholder': string,'placeholder-disabled': string,'translucent': string}

    export function useAppColors() {
      const colors = {"light":{"background":"#F3F1F2","card-background":"#F3F1F2","input-background":"#F3F1F2","modal-background":"#F3F1F2","text":"#252538","card-text":"#252538","main-brand":"#6067B1","main-brand-hover":"#4F5590","light-shades":"#F3F1F2","light-accent":"#8478B8","light-accent-hover":"#6B5B9E","dark-accent":"#AC4259","dark-accent-hover":"#903548","dark-shades":"#252538","default":"#888888","success":"#5d9966","success-hover":"#4c8053","warning":"#da892e","warning-hover":"#b26e24","danger":"#f44336","danger-hover":"#c7352b","info":"#7A6AAE","info-hover":"#6B5B9E","border":"#9E8ECB","disabled-background":"#E0E0E0","disabled-text":"#A0A0A0","disabled-border":"#D1D1D1","placeholder":"#B0B0B0","placeholder-disabled":"#9d9d9d","translucent":"#0000000d"},"dark":{"background":"#1C1C1E","card-background":"#2C2C2E","input-background":"#3A3A3C","modal-background":"#242424","text":"#F3F1F2","card-text":"#d0c8cc","main-brand":"#686CCF","main-brand-hover":"#42477A","light-shades":"#7A6AAE","light-accent":"#A397E1","light-accent-hover":"#42477A","dark-accent":"#AC4259","dark-accent-hover":"#903548","dark-shades":"#1C1C1E","default":"#707070","success":"#5d9966","success-hover":"#4c8053","warning":"#da892e","warning-hover":"#b26e24","danger":"#f44336","danger-hover":"#c7352b","info":"#7A6AAE","info-hover":"#6B5B9E","border":"#6C6C6E","disabled-background":"#2E2E30","disabled-text":"#6C6C6E","disabled-border":"#3D3D3F","placeholder":"#7A7A7C","placeholder-disabled":"#58585a","translucent":"#ffffff0d"}}
      const theme = useColorMode()
      return {
        //@ts-expect-error
        currentColors: computed<AppColors>(x => colors[theme.value] || colors.dark),
        light: colors['light'], dark: colors['dark']
      }
    }

    export function useColorChooser() {
      const theme = useColorMode()
      // @ts-expect-error
      const isStable = useThemeNames().includes(theme.value)

      const colors = useAppColors()
      return ((lightColor: keyof AppColors,darkColor: keyof AppColors) => computed<string>(() => {
        const l = {'light': lightColor,'dark': darkColor}
        const t = computed(() => isStable ? theme.value : 'dark')
        //@ts-expect-error
        return colors[t.value][l[t.value]] || l[t.value]
      })) as {
        (lightColor: keyof AppColors,darkColor: keyof AppColors): ComputedRef<string>,
        (lightColor: string,darkColor: string): ComputedRef<string>,
      }
    }

    export function useThemeNames() {
      return ["light","dark"] as const
    }

    export function __useThemeCode(appColors: ComputedRef<AppColors>) {
      return naiveUiOverrides(appColors)
    }
  