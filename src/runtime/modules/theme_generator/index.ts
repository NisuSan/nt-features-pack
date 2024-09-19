import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineNuxtModule } from '@nuxt/kit'
import { defaultColorShema, themeMixins, themeNaiveUi, themeVanillaCss, tailwindFileContent, themeComposable } from './theme.templates.ts'
import { createFile } from '../../utils/index.ts'

export interface ModuleOptions {
  location: 'internal' | 'external',
  target: 'naive-ui' | 'css',
  scssMixins: [string[], 'apppend' | 'replace'],
  themeCss: [string[], 'apppend' | 'replace'],
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'themeGenerator',
    configKey: 'themeGenerator',
  },
  setup(_options, _nuxt) {
    try {
      const themeDir = _options.location === 'internal' ? 'autogenerated/client/theme' : '../theme'
      const rootDir = resolve(_nuxt.options.buildDir, themeDir).replace(/\\/g, '/')

      createFile(resolve(rootDir, 'theme.colors.ts'), `export default ${JSON.stringify(defaultColorShema)}`)

      const mixins = (_options.scssMixins[1] === 'apppend' ? themeMixins + '\n\n' : '') + _options.scssMixins[0].map(x => `/*content from <${x}>*/\n${readFileSync(x, 'utf-8').toString()}`).join('\n\n')
      createFile(resolve(rootDir, `theme.mixins.scss`), mixins)

      const css = (_options.themeCss[1] === 'apppend' ? (_options.target === 'naive-ui' ? themeNaiveUi : themeVanillaCss) + '\n\n' : '') + _options.themeCss[0].map(x => `/*content from <${x}>*/\n${readFileSync(x, 'utf-8').toString()}`).join('\n\n')
      createFile(resolve(rootDir, `theme.styles.scss`), css)

      const content = tailwindFileContent + ['mixins', 'styles'].map(x => `\n@include "${rootDir}/theme.${x}.scss";`).join('')
      createFile(resolve('./src/runtime/tailwindcss/tailwind.css'), content)

      createFile(resolve(resolve(_nuxt.options.buildDir, 'autogenerated/client/composables/theme.ts').replace(/\\/g, '/')), themeComposable())
    } catch (error) {
      console.error(error)
    }
  },
})

