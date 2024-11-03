import { useThemeNames } from './generableComposables.ts'
import { useColorMode, useDark, useToggle } from '@vueuse/core'
import type { GlobalThemeOverrides } from 'naive-ui'
import { computed } from 'vue'
import { naiveUiOverrides } from '../modules/theme_generator/source/naiveUiOverrides.ts'

export function useTheme(componentsStyle: GlobalThemeOverrides = {}) {
  const possibleThemes = useThemeNames()

  const isDark = useDark({ attribute: 'theme', valueDark: 'dark', valueLight: 'light' })
  const toggleTheme = useToggle(isDark)

  const themeName = useColorMode({ attribute: 'theme', modes: Object.fromEntries(possibleThemes.map(n => [n, n])) })
  const nextThemeName = computed(() => isDark.value ? 'light' : 'dark')
  const setTheme = ((theme: typeof possibleThemes[number]) => themeName.value = theme ) as {
    (theme: typeof possibleThemes[number]): void,
    (theme: string): void,
  }

  const themeUI = naiveUiOverrides(componentsStyle)

  return { toggleTheme, setTheme, themeName, nextThemeName, themeUI }
}
