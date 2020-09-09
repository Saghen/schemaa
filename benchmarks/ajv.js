const config = require('./config')
const { array, arraySimple, deepObject, shallowObject, generateShallowObject, largeObject } = require('./data')
const { runFunctionManyTimes } = require('./helpers')

// TODO: Is it actually possible to beat AJV? And is it necessary at all lol
const Ajv = require('ajv')

// Shallow Object
const shallowObjectValidator = new Ajv().compile({
  properties: generateShallowObject(config.shallowObject.count, { type: 'number' }),
})
runFunctionManyTimes(config.runCount, () => {
  shallowObjectValidator(shallowObject)
})

console.time('ajv - shallow object')
shallowObjectValidator(shallowObject)
console.timeEnd('ajv - shallow object')

// Deep Object
function generateDeepSchemaAjv(levels) {
  let temp = {
    type: 'object',
    properties: {},
  }
  const obj = temp
  for (let i = 0; i < levels; i++) {
    temp.properties.a = {
      type: 'object',
      properties: {},
    }
    temp = temp.properties.a
  }
  return obj
}

const deepObjectValidator = new Ajv().compile(generateDeepSchemaAjv(config.deepObject.levels - 1))
runFunctionManyTimes(config.runCount, () => {
  deepObjectValidator(deepObject)
})

console.time('ajv - deep object')
deepObjectValidator(deepObject)
console.timeEnd('ajv - deep object')

// Large Object
const largeObjectValidator = new Ajv().compile({
  properties: generateShallowObject(
    config.largeObject.count,
    generateDeepSchemaAjv(config.largeObject.levels - 1)
  ),
})
runFunctionManyTimes(config.runCount, () => {
  largeObjectValidator(largeObject)
})

console.time('ajv - large object')
largeObjectValidator(largeObject)
console.timeEnd('ajv - large object')

// Array
const arrayValidator = new Ajv().compile({
  properties: {
    array: {
      type: 'array',
      items: {
        type: 'object',
        required: ['foo'],
        properties: {
          foo: {
            type: 'string',
          },
        },
      },
    },
  }
})

runFunctionManyTimes(config.runCount, () => {
  arrayValidator(array)
})

console.time('ajv - array')
arrayValidator(array)
console.timeEnd('ajv - array')

// Array Simple
const arraySimpleValidator = new Ajv().compile({
  properties: {
    array: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
})

runFunctionManyTimes(config.runCount, () => {
  arraySimpleValidator(arraySimple)
})

console.time('ajv - array simple')
arraySimpleValidator(arraySimple)
console.timeEnd('ajv - array simple')
