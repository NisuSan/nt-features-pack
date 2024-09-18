import { resolve } from 'node:path'
import { defineNuxtModule, addImports } from '@nuxt/kit'
import { defaultShemas, themeMixins } from './theme.templates.ts'
import { createFile } from '../../utils/index.ts'

export default defineNuxtModule({
  meta: {
    name: 'themeGenerator',
    configKey: 'themeGenerator',
  },
  setup(_options, _nuxt) {
    try {
      const rootDir = resolve(_nuxt.options.buildDir, '../theme')

      for (const [name, shema] of Object.entries(defaultShemas)) {
        createFile(resolve(rootDir, 'shemas', `${name}.ts`), `export default ${JSON.stringify(shema)}`)
      }

      createFile(resolve(rootDir, `theme.mixins.scss`), themeMixins)
    } catch (error) {
      console.error(error)
    }
  },
})
