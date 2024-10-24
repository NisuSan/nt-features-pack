import { useAppColors, useThemeNames, __useThemeCode } from './generableComposables.ts'
import { useColorMode, useDark, useToggle } from '@vueuse/core'
import { type ComputedRef, computed } from 'vue'

export function useTheme() {
  const { currentColors } = useAppColors()
  const possibleThemes = useThemeNames()

  const isDark = useDark({ attribute: 'theme', valueDark: 'dark', valueLight: 'light' })
  const toggleTheme = useToggle(isDark)

  const themeName = useColorMode({ attribute: 'theme', modes: Object.fromEntries(possibleThemes.map(n => [n, n])) })
  const nextThemeName = computed(() => isDark.value ? 'light' : 'dark')
  const setTheme = ((theme: typeof possibleThemes[number]) => themeName.value = theme ) as {
    (theme: typeof possibleThemes[number]): void,
    (theme: string): void,
  }

  const themeUI = __useThemeCode(currentColors)

  return { toggleTheme, setTheme, themeName, nextThemeName, themeUI }
}
