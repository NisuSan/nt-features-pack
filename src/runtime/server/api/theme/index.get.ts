import { defineEventHandler } from '#imports'

type QueryArgs = { }

export default defineEventHandler(async event => {
  return { test: '1' }
})
