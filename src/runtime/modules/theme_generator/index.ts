import { readFileSync } from 'node:fs'
import { defineNuxtModule } from '@nuxt/kit'
import { defaultColorShema, tailwindFileContent, injectColorsToTailwind, createGenerableComposables, themeComposableGenerator } from './theme.templates.ts'
import { createFile, resolve } from '../../utils/index.ts'

export interface ModuleOptions {
  disable: boolean,
  target: 'naive-ui' | 'css',
  location: 'internal' | 'external',
  scssMixins: [string[], 'apppend' | 'replace'],
  themeCss: [string[], 'apppend' | 'replace'],
  themeCode: `${string} => ${string}`
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'themeGenerator',
    configKey: 'themeGenerator',
  },
  setup(_options, _nuxt) {
    try {
      const isInternal = _options.location === 'internal'
      const themeDir = isInternal ? 'client/theme' : '../../theme'
      const rootDir = resolve(themeDir, 'build')

      createFile(resolve(rootDir, 'theme.colors.ts', 'build'), `export default ${JSON.stringify(defaultColorShema)}`)
      injectColorsToTailwind(isInternal)

      const mixins = (_options.scssMixins![1] === 'apppend' ? readFileSync(resolve('../theme_generator/source/mixins.scss'), 'utf-8').toString() + '\n\n' : '') + _options.scssMixins![0].map(x => `/*content from <${x}>*/\n${readFileSync(x, 'utf-8').toString()}`).join('\n\n')
      const css = (_options.themeCss![1] === 'apppend' ? (_options.target === 'naive-ui' ? readFileSync(resolve('../theme_generator/source/naiveUi.scss'), 'utf-8').toString() : '') + '\n\n' : '') + _options.themeCss![0].map(x => `/*content from <${x}>*/\n${readFileSync(x, 'utf-8').toString()}`).join('\n\n')
      createFile(resolve(rootDir, `styles.scss`, 'build'), mixins + '\n\n' + css)

      const content = tailwindFileContent + `\n@import "${rootDir}/styles.scss";`
      createFile(resolve('../../tailwindcss/tailwind.css'), content)

      createGenerableComposables()
      themeComposableGenerator(_options.themeCode)
    } catch (error) {
      console.error(error)
    }
  },
})
