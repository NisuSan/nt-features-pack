import { defineNuxtModule, installModule, extendPages, addImportsDir, useNuxt } from '@nuxt/kit'
import { type ModuleOptions as TailwindModuleOptions } from '@nuxtjs/tailwindcss'
import { resolve, resolveBuild } from './runtime/utils/index.ts'

// Module options TypeScript interface definition
export interface ModuleOptions {
  apiGenerator: {
    disable?: boolean,
    includeFiles?: string[]
  },
  themeGenerator: {
    disable?: boolean,
    target?: 'naive-ui' | 'css',
    location?: 'internal' | 'external',
    scssMixins?: [string[], 'apppend' | 'replace'],
    themeCss?: [string[], 'apppend' | 'replace'],
    themeCode?: `${string} => ${string}`
  },
  tailwind?: {
    internal: boolean,
    config?: TailwindModuleOptions
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
      includeFiles: [`<serverDir>/api/**/*.ts`, `!<serverDir>/api/**/index.ts`]
    },
    themeGenerator: {
      disable: false,
      location: 'internal',
      target: 'naive-ui',
      scssMixins: [[], 'apppend'],
      themeCss: [[], 'apppend'],
      themeCode: `${resolve('./runtime/modules/theme_generator/source/naiveUiOverrides.ts')} => naiveUiOverrides`
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
    }
  },
  async setup(_options, _nuxt) {
    // if(!_options.apiGenerator.disable) {
    //   await installModule(resolve('./runtime/modules/api_generator/index.ts'), _options.apiGenerator)
    // } commended for more perfomance in another module

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
      await installModule('@nuxtjs/tailwindcss', _options.tailwind.config)
    }

    await installModule('@vueuse/nuxt')
    addImportsDir(resolve('./runtime/composables'))
  },
})
