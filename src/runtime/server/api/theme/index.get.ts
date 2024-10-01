import { defineEventHandler, useRuntimeConfig } from '#imports'
import { readFileSync } from 'node:fs'

export default defineEventHandler(async event => {
  // @ts-expect-error
  const themeLocation = useRuntimeConfig(event).public.ntFeaturesPack?.themeGenerator?.location
  const colors: Record<string, string> = JSON.parse(readFileSync(`${themeLocation}/theme.colors.ts`, 'utf-8').toString().match(/export\s+default\s?({[\s\S]*});?/)?.[1] || '{}')

  const result: Record<string, Record<string, string>> = {}
  Object.entries(colors).forEach(([key, value]) => (result[key.split('-')[0]] ??= {})[key] = value)

  return result
})
