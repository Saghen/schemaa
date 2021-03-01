const { Suite } = require('benchmark')
const suite = new Suite()

const { Schema } = require('../dist')
const config = require('./config')

const {
  array,
  arraySimple,
  deepObject,
  generateDeepObject,
  shallowObject,
  generateShallowObject,
  largeObject,
  arrayDeep,
} = require('./data')

// Shallow Object
const validatorShallowObject = new Schema(generateShallowObject(config.shallowObject.count, Number))

suite.add('schemaa - shallow object', () => {
  validatorShallowObject.validate(shallowObject)
})

// Deep Object
const validatorDeepObject = new Schema(generateDeepObject(config.deepObject.levels))

suite.add('schemaa - deep object', () => {
  validatorDeepObject.validate(deepObject)
})

// Large Object
const validatorLargeObject = new Schema(
  generateShallowObject(config.largeObject.count, generateDeepObject(config.largeObject.levels))
)

suite.add('schemaa - large object', () => {
  validatorLargeObject.validate(largeObject)
})

// Array Deep
const validatorArrayDeep = new Schema({
  array: [generateDeepObject(config.deepObject.levels)],
})

suite.add('schemaa - array deep', () => {
  validatorArrayDeep.validate(arrayDeep)
})

// Array
const validatorArray = new Schema({
  array: [{ foo: { type: String } }],
})

suite.add('schemaa - array', () => {
  validatorArray.validate(array)
})

// Array Simple
const validatorArraySimple = new Schema({
  array: [String],
})

suite.add('schemaa - array simple', () => validatorArraySimple.validate(arraySimple))

suite.on('cycle', e => console.log(String(e.target)))

suite.run()
