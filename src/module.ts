import { defineNuxtModule, addPlugin, createResolver, installModule } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
  apiGenerator: {
    disable: boolean
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nt-features-pack',
    configKey: 'ntFeaturesPack',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    apiGenerator: {
      disable: false,
    }
  },
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    if(!_options.apiGenerator.disable) {
      await installModule(resolve('./runtime/modules/api_generator/index.ts'))
    }
  },
})
