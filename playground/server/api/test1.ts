type QueryArgs = { id: number }

export default defineEventHandler(async event => {
  const test = { a: [1,2,3], b: '1' }
  return {
    service: 'work',
    date: new Date('2023-09-15 13:45:00').toLocaleString(),
  }
})
