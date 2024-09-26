import { useAppColors, useThemeNames } from './generableComposables.ts'
import { useColorMode, useDark, useToggle } from '@vueuse/core'
import { useNuxtApp } from 'nuxt/app'
import { computed } from 'vue'

export function useTheme() {
  const appColors = useAppColors() as Record<string, string>
  const possibleThemes = useThemeNames()

  const isDark = useDark({ attribute: 'theme', valueDark: 'dark', valueLight: 'light' })
  const toggleTheme = useToggle(isDark)

  const themeName = useColorMode({ attribute: 'theme', modes: Object.fromEntries(possibleThemes.map(n => [n, n])) })
  const nextThemeName = computed(() => isDark.value ? 'light' : 'dark')
  const setTheme = (theme: typeof possibleThemes[number]) => themeName.value = theme

  // const themeUI = useNuxtApp().$

  return { toggleTheme, setTheme, themeName, nextThemeName }
}
