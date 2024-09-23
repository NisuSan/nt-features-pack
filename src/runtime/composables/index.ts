import * as twConfig from '../tailwindcss/tailwind.config.ts'

export function useTheme() {
  console.log(useAppColors())
}

export function useAppColors() {
  return twConfig.default.theme?.extend?.colors as AppColors
}

export function useTestDuplicate() {
  console.log('test')
}
