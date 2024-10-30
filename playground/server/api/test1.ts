type QueryArgs = { id: number }

export default defineEventHandler(async event => {
 return {
  a: {},
  b: {}
 } as {
  a: PrismaJson.DistrictInfo
  b: PrismaJson.BankInfo
 }
})
