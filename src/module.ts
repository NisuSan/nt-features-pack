import { defineNuxtModule, createResolver, installModule, extendPages, addImportsDir } from '@nuxt/kit'
import { type ModuleOptions as TailwindModuleOptions } from '@nuxtjs/tailwindcss'
import { type ComputedRef, computed } from 'vue'
import { type GlobalThemeOverrides } from 'naive-ui'
import { naiveUiOverrides } from './runtime/modules/theme_generator/source/naiveUiOverrides.ts'

type ThemeGeneratorBase = {
  disable?: boolean,
  location?: 'internal' | 'external',
  scssMixins?: [string[], 'apppend' | 'replace'],
  themeCss?: [string[], 'apppend' | 'replace'],
}

export type ThemeGeneratorOptions =
  | ThemeGeneratorBase & { target?: 'naive-ui', themeCode?: ((AppColors: Record<string, string>, themeName: ComputedRef<string>) => ComputedRef<GlobalThemeOverrides>) | GlobalThemeOverrides }
  | ThemeGeneratorBase & { target?: 'css', themeCode?: (AppColors: Record<string, string>, themeName: ComputedRef<string>) => ComputedRef<unknown> }

// Module options TypeScript interface definition
export interface ModuleOptions {
  apiGenerator: {
    disable?: boolean,
    includeFiles?: string[]
  },
  themeGenerator: ThemeGeneratorOptions,
  tailwind?: {
    internal: boolean,
    config?: TailwindModuleOptions
  }
}

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nt-features-pack',
    configKey: 'ntFeaturesPack',
  },
  // Default configuration options of the Nuxt module
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
      themeCode: naiveUiOverrides()
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
    if(!_options.apiGenerator.disable) {
      await installModule(resolve('./runtime/modules/api_generator/index.ts'), _options.apiGenerator)
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
      await installModule('@nuxtjs/tailwindcss', _options.tailwind.config)
    }

    await installModule('@vueuse/nuxt')
    addImportsDir(resolve('./runtime/composables'))
  },
})
