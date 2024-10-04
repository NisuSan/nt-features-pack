import { defineNuxtModule, installModule, extendPages, addImportsDir } from '@nuxt/kit'
import { type ModuleOptions as TailwindModuleOptions } from '@nuxtjs/tailwindcss'
import { resolve } from './runtime/utils/index.ts'

export interface ModuleOptions {
  apiGenerator: {
    disable?: boolean,
    includeFiles?: string[],
    functionName: string
  },
  themeGenerator: {
    disable?: boolean,
    target?: 'naive-ui' | 'css',
    location?: string,
    scssMixins?: [string[], 'apppend' | 'replace'],
    themeCss?: [string[], 'apppend' | 'replace'],
    themeCode?: [string, string]
  },
  tailwind?: {
    internal: boolean,
    config?: TailwindModuleOptions
  },
  iconify?: {
    disable?: boolean,
    iconPacks?: string[],
    provider?: 'css' | 'tailwind'
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nt-features-pack',
    configKey: 'ntFeaturesPack',
  },
  defaults: {
    apiGenerator: {
      disable: false,
      includeFiles: [`<serverDir>/api/**/*.ts`, `!<serverDir>/api/**/index.ts`],
      functionName: 'api'
    },
    themeGenerator: {
      disable: false,
      location: './theme',
      target: 'naive-ui',
      scssMixins: [[], 'apppend'],
      themeCss: [[], 'apppend'],
      themeCode: [resolve('./runtime/modules/theme_generator/source/naiveUiOverrides.ts'), 'naiveUiOverrides']
    },
    tailwind: {
      internal: true,
      config: {
        cssPath: [resolve('./runtime/tailwindcss/tailwind.css'), { injectPosition: "first" }],
        configPath: resolve('./runtime/tailwindcss/tailwind.config.ts'),
        config: {
          content: [ resolve('./runtime/pages/themes.vue'), ]
        }
      }
    },
    iconify: {
      disable: false,
      iconPacks: ['mdi'],
      provider: 'tailwind'
    }
  },
  async setup(_options, _nuxt) {
    if(!_options.apiGenerator.disable) {
      installModule(resolve('./runtime/modules/api_generator/index.ts'), {..._options.apiGenerator, isThemeGeneratorActive: !_options.themeGenerator.disable}).then(x => {})
    }

    if(!_options.themeGenerator.disable) {
      extendPages(pages => {
        pages.unshift({
          name: 'themes',
          path: '/_themes',
          file: resolve('./runtime/pages/themes.vue'),
        })
      })

      await installModule(resolve('./runtime/modules/theme_generator/index.ts'), _options.themeGenerator)
    }

    if(_options.tailwind?.internal) {
      installModule('@nuxtjs/tailwindcss', _options.tailwind.config).then(x => {})
    }

    await installModule('@vueuse/nuxt')
    addImportsDir(resolve('./runtime/composables'))
  },
})
