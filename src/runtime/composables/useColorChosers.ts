
    import {type ComputedRef } from 'vue'
    export function useColorChosers(themeName: ComputedRef<string>) {
      // @ts-expect-error
      return (light: string, dark: string): string => ({light, dark}[themeName.value])
    }
  