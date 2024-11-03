import { readFileSync, existsSync } from 'node:fs'
import { defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'
import { defaultColorShema, tailwindFileContent, buildCssColors, createGenerableComposables, generateRuntimeApiRoutes } from './theme.templates.ts'
import { createFile, resolve } from '../../utils/index.ts'

export interface ModuleOptions {
  disable: boolean,
  target: 'naive-ui' | 'css',
  location: string,
  scssMixins: [string[], 'apppend' | 'replace'],
  themeCss: [string[], 'apppend' | 'replace'],
  tailwindUtilsExtension?: string,
  isIconify?: boolean
  iconifyCss?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'themeGenerator',
    configKey: 'themeGenerator',
  },
  setup(_options, _nuxt) {
    try {
      const rootDir = resolve(_options.location, 'src')
      const ctsFile = resolve(rootDir, 'theme.colors.ts')

      const mixins = (_options.scssMixins![1] === 'apppend'
        ? readFileSync(resolve('../theme_generator/source/mixins.scss'), 'utf-8').toString() + '\n\n'
        : '') + _options.scssMixins![0].map(x => `/*content from <${x}>*/\n${readFileSync(x, 'utf-8').toString()}`).join('\n\n')

      const css = (_options.themeCss![1] === 'apppend'
        ? (_options.target === 'naive-ui' ? readFileSync(resolve('../theme_generator/source/naiveUi.scss'), 'utf-8').toString() : '') + '\n\n'
        : '') + _options.themeCss![0].map(x => `/*content from <${x}>*/\n${readFileSync(x, 'utf-8').toString()}`).join('\n\n')
              + (!_options.isIconify ? '\n\n' + readFileSync(resolve('../iconify/index.scss'), 'utf-8').toString() : '')
              + (_options.iconifyCss ? '\n\n' + readFileSync(_options.iconifyCss, 'utf-8').toString() : '')

      if(!existsSync(ctsFile)) createFile(ctsFile, `export default ${JSON.stringify(defaultColorShema, null, 2)}`)
      createFile(resolve(rootDir, 'styles.scss', 'src'), mixins + '\n\n' + css)
      createFile(resolve(rootDir, 'theme.colors.css', 'src'), buildCssColors(rootDir))

      const content = tailwindFileContent + `\n@import "${rootDir}/styles.scss";\n@import "${rootDir}/theme.colors.css";`
        + (_options.tailwindUtilsExtension ? '\n\n' + readFileSync(resolve(_options.tailwindUtilsExtension), 'utf-8').toString() : '')
      createFile(resolve('../../tailwindcss/tailwind.css'), content)

      createGenerableComposables(_options.location)

      if(process.env.NODE_ENV === 'development') {
        generateRuntimeApiRoutes()
        // @ts-expect-error
        _nuxt.options.runtimeConfig.public.ntFeaturesPack = defu(_nuxt.options.runtimeConfig.public.ntFeaturesPack, { themeGenerator: { location: rootDir } })
      }
    } catch (error) {
      console.error(error)
    }
  },
})
