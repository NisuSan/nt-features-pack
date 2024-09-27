import { defineNuxtModule, addImports } from '@nuxt/kit'
import { composableApiTemplate } from './api.templates.ts'
import { createFile, resolve } from '../../utils/index.ts'

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
      const file = resolve('client/composables/api.ts', 'build')

      createFile(file, composableApiTemplate(_options))
      addImports({ name: 'api', from: file })
    } catch (error) {
      console.error(error)
    }
  },
})
