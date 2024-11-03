import { defineNuxtModule, installModule, extendPages, addImportsDir, addComponent, addComponentsDir, addPlugin } from '@nuxt/kit'
import { type ModuleOptions as TailwindModuleOptions } from '@nuxtjs/tailwindcss'
import { defu } from 'defu'
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
    tailwindUtilsExtension?: string
  },
  tailwind?: {
    internal: boolean,
    config?: TailwindModuleOptions
  },
  iconify?: {
    disable?: boolean,
    provider?: 'css' | 'tailwind',
    css?: string
  },
  joi: {
    messages?: {
      base: Record<string, string>,
      validators: Record<string, Record<string, string>>
    }
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
      themeCss: [[], 'apppend']
    },
    tailwind: {
      internal: true,
      config: {
        cssPath: [resolve('./runtime/tailwindcss/tailwind.css'), { injectPosition: 'first' }],
        configPath: resolve('./runtime/tailwindcss/tailwind.config.ts'),
      }
    },
    iconify: {
      disable: false,
      provider: 'tailwind',
    }
  },
  async setup(_options, _nuxt) {
    // @ts-expect-error
    _nuxt.options.runtimeConfig.public.ntFeaturesPack = defu(_nuxt.options.runtimeConfig.public.ntFeaturesPack, {
      joi: _options.joi
    })

    addImportsDir(resolve('./runtime/composables'))
    addPlugin(resolve('./runtime/plugins/tippy.ts'))
    await addComponentsDir({ path: resolve('./runtime/components') })

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

      await installModule(resolve('./runtime/modules/theme_generator/index.ts'), { ..._options.themeGenerator, isIconify: _options.iconify?.disable, iconifyCss: _options.iconify?.css })
    }

    if(_options.tailwind?.internal) {
      installModule('@nuxtjs/tailwindcss', defu(_options.tailwind.config, {
        config: {
          content: [
            resolve('./runtime/pages/themes.vue'),
            resolve('./runtime/components/**/*.vue'),
          ],
        }
      })).then(x => {})
    }

    if(!_options.iconify?.disable) {
      addComponent({
        name: 'CIcon',
        export: 'CIcon',
        filePath: resolve('./runtime/components'),
      })
    }

    await installModule('@vueuse/nuxt')
  },
})

