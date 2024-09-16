import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { rimrafSync } from 'rimraf'
import { defineNuxtModule, addImports, useNuxt  } from '@nuxt/kit'
// import { composableApiTemplate } from './api.templates.ts'

export default defineNuxtModule({
  meta: {
    name: 'apiComposableGenerator',
    configKey: 'apiComposableGenerator',
  },
  setup() {
    const rootDir = resolve(useNuxt().options.buildDir, 'autogenerated')

    // try {
    //   if(!existsSync(rootDir + '/client/ui')) mkdirSync(rootDir + '/client/ui', { recursive: true })
    //   const composableApiFileOutput = resolve(rootDir, 'client/ui/index.ts')

    //   rimrafSync(composableApiFileOutput)
    //   writeFileSync(composableApiFileOutput, composableApiTemplate(), { encoding: 'utf-8' })

    //   addImports({
    //     name: 'api',
    //     from: resolve(rootDir, 'client/index.ts')
    //   })
    // } catch (error) {
    //   console.error(error)
    // }
  },
})
