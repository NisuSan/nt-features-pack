import Joi from 'joi'

type QueryArgs = { id: number }

export default defineEventHandler(async event => {
  const test = { a: [1,2,3], b: '1' }
  validate(test, {
    a: Joi.array().items(Joi.number().positive().integer().required()),
    b: Joi.string().not(Joi.string().empty())
  })


  return {
    service: 'work',
    date: new Date('2023-09-15 13:45:00').toLocaleString(),
  }
})
