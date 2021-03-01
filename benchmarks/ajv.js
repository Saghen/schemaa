const { Suite } = require('benchmark')
const suite = new Suite()

const config = require('./config')
const { array, arraySimple, arrayDeep, deepObject, shallowObject, generateShallowObject, largeObject } = require('./data')

// TODO: Is it actually possible to beat AJV? And is it necessary at all lol
const Ajv = require('ajv')

// Shallow Object
const shallowObjectValidator = new Ajv().compile({
  properties: generateShallowObject(config.shallowObject.count, { type: 'number' }),
})

suite.add('ajv - shallow object', () => {
  shallowObjectValidator(shallowObject)
})

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

suite.add('ajv - deep object', () => {
  deepObjectValidator(deepObject)
})

// Large Object
const largeObjectValidator = new Ajv().compile({
  properties: generateShallowObject(
    config.largeObject.count,
    generateDeepSchemaAjv(config.largeObject.levels - 1)
  ),
})

suite.add('ajv - large object', () => {
  largeObjectValidator(largeObject)
})

// Array
const arrayDeepValidator = new Ajv().compile({
  properties: {
    array: {
      type: 'array',
      items: generateDeepSchemaAjv(config.deepObject.levels - 1),
    },
  },
})

suite.add('ajv - array deep', () => {
  arrayDeepValidator(arrayDeep)
})

// Array deep
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
  },
})

suite.add('ajv - array', () => {
  arrayValidator(array)
})

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

suite.add('ajv - array simple', () => {
  arraySimpleValidator(arraySimple)
})

suite.on('cycle', (e) => console.log(String(e.target)))

suite.run()
