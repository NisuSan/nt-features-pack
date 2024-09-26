import { defineNuxtModule, addImports } from '@nuxt/kit'
import { composableApiTemplate } from './api.templates.ts'
import { createFile, resolveBuild } from '../../utils/index.ts'

export interface ModuleOptions {
  includeFiles: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'apiComposableGenerator',
    configKey: 'apiComposableGenerator',
  },
  setup(_options, _nuxt) {
    try {
      const file = resolveBuild('client/composables/api.ts')

      createFile(file, composableApiTemplate(_options))
      addImports({ name: 'api', from: file })
    } catch (error) {
      console.error(error)
    }
  },
})
