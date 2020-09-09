const { Validator, string, boolean, number, bigInt, func } = require('../src/index')
const config = require('./config')
const { runFunctionManyTimes } = require('./helpers')

const { array, arraySimple, deepObject, generateDeepObject, shallowObject, generateShallowObject, largeObject } = require('./data')

// Shallow Object
const validatorShallowObject = new Validator(generateShallowObject(config.shallowObject.count, number))

runFunctionManyTimes(config.runCount, () => {
  validatorShallowObject.validate(shallowObject)
})

console.time('schemaa - shallow object')
validatorShallowObject.validate(shallowObject)
console.timeEnd('schemaa - shallow object')

// Deep Object
const validatorDeepObject = new Validator(generateDeepObject(config.deepObject.levels))

runFunctionManyTimes(config.runCount, () => {
  validatorDeepObject.validate(deepObject)
})

console.time('schemaa - deep object')
validatorDeepObject.validate(deepObject)
console.timeEnd('schemaa - deep object')

// Large Object
const validatorLargeObject = new Validator(
  generateShallowObject(config.largeObject.count, generateDeepObject(config.largeObject.levels))
)

runFunctionManyTimes(config.runCount, () => {
  validatorLargeObject.validate(largeObject)
})

console.time('schemaa - large object')
validatorLargeObject.validate(largeObject)
console.timeEnd('schemaa - large object')

// Array
const validatorArray = new Validator({
  array: [{ foo: { type: string } }],
})

runFunctionManyTimes(config.runCount, () => {
  validatorArray.validate(array)
})

console.time('schemaa - array')
validatorArray.validate(array)
console.timeEnd('schemaa - array')

// Array Simple
const validatorArraySimple = new Validator({
  array: [string],
})

runFunctionManyTimes(config.runCount, () => {
  validatorArraySimple.validate(arraySimple)
})

console.time('schemaa - array simple')
validatorArraySimple.validate(arraySimple)
console.timeEnd('schemaa - array simple')
