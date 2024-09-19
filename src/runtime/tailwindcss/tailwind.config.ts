import type { Config } from 'tailwindcss'
import { useAppColors } from '../composables/index.ts'

const defaultFonts= ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica Neue', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"']

export default <Partial<Config>> {
  theme: {
    fontFamily: {
      sans: ['"JetBrains+Mono"', ...defaultFonts],
    },
    container: {
      center: true,
    },
    extend: {
      colors: useAppColors(),
      fontFamily: {
        logo: ['Rubik', ...defaultFonts]
      },
      boxShadow: {
        soft: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        harder: 'rgba(0, 0, 0, 0.15) 0px 2px 8px'
      }
    }
  }
}


