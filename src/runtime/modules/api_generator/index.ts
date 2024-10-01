import { defineNuxtModule, addImports } from '@nuxt/kit'
import { composableApiTemplate } from './api.templates.ts'
import { createFile, resolve } from '../../utils/index.ts'

export interface ModuleOptions {
  includeFiles: string[],
  isThemeGeneratorActive: boolean,
  functionName: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'apiComposableGenerator',
    configKey: 'apiComposableGenerator',
  },
  setup(_options, _nuxt) {
    try {
      const file = resolve('../../composables/apiComposables.ts')
      const content = composableApiTemplate(_options)

      if(content) {
        createFile(file, content)
        addImports({ name: _options.functionName, from: file })
      }
    } catch (error) {
      console.error(error)
    }
  },
})
