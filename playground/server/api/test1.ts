type QueryArgs = { id: number }

export default defineEventHandler(async event => {
  console.log(useRuntimeConfig());

})
