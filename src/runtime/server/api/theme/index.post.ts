import { defineEventHandler } from '#imports'

type QueryArgs = { name: string }

export default defineEventHandler(async event => {
  return { theme: 'dasdad' }
})
