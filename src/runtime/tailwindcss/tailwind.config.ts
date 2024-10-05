import type { Config } from 'tailwindcss'
import { addDynamicIconSelectors } from '@iconify/tailwind'

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
      fontFamily: {
        logo: ['Rubik', ...defaultFonts]
      },
      boxShadow: {
        soft: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
        harder: 'rgba(0, 0, 0, 0.15) 0px 2px 8px'
      },
        colors: {"light-background":"#F3F1F2","light-card-background":"transparent","light-input-background":"transparent","light-text":"#252538","light-main-brand":"#6067B1","light-main-brand-hover":"#4F5590","light-light-shades":"#F3F1F2","light-light-accent":"#8478B8","light-light-accent-hover":"#6B5B9E","light-dark-accent":"#AC4259","light-dark-accent-hover":"#903548","light-dark-shades":"#252538","light-default":"#888888","light-success":"#5d9966","light-success-hover":"#4c8053","light-warning":"#da892e","light-warning-hover":"#b26e24","light-danger":"#f44336","light-danger-hover":"#c7352b","light-info":"#7A6AAE","light-info-hover":"#6B5B9E","light-border":"#9E8ECB","light-disabled-background":"#E0E0E0","light-disabled-text":"#A0A0A0","light-disabled-border":"#D1D1D1","light-placeholder":"#B0B0B0","light-placeholder-disabled":"#9d9d9d","dark-background":"#1C1C1E","dark-card-background":"#2C2C2E","dark-input-background":"#3A3A3C","dark-text":"#F3F1F2","dark-card-text":"#d0c8cc","dark-main-brand":"#686CCF","dark-main-brand-hover":"#42477A","dark-light-shades":"#7A6AAE","dark-light-accent":"#A397E1","dark-light-accent-hover":"#42477A","dark-dark-accent":"#AC4259","dark-dark-accent-hover":"#903548","dark-default":"#707070","dark-success":"#5d9966","dark-success-hover":"#4c8053","dark-warning":"#da892e","dark-warning-hover":"#b26e24","dark-danger":"#f44336","dark-danger-hover":"#c7352b","dark-info":"#7A6AAE","dark-info-hover":"#6B5B9E","dark-border":"#6C6C6E","dark-disabled-background":"#2E2E30","dark-disabled-text":"#6C6C6E","dark-disabled-border":"#3D3D3F","dark-placeholder":"#7A7A7C","dark-placeholder-disabled":"#58585a"}
    }
  },
  safelist: [
    {
      pattern: /(bg|text)-(light|dark)-(.*)/,
      variants: ['hover']
    }
  ],
  plugins: [
    addDynamicIconSelectors()
  ]
}


