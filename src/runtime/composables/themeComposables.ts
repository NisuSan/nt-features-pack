
    import { type ComputedRef } from 'vue'
    import { naiveUiOverrides } from 'C:/Users/Antony/Documents/coding/nt-features-pack/src/runtime/modules/theme_generator/source/naiveUiOverrides.ts'
    export function __useThemeCode(appColors: Record<string, string>, themeName: ComputedRef<string>) {
      return naiveUiOverrides(appColors, themeName)
    }
  