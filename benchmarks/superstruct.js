const config = require('./config')
const { runFunctionManyTimes } = require('./helpers')
const { array, arraySimple, deepObject, shallowObject, generateShallowObject } = require('./data')

const { struct } = require('superstruct')

// Shallow Object
const validateShallowObject = struct(generateShallowObject(config.shallowObject.count, 'number'))

runFunctionManyTimes(config.runCount, () => {
  validateShallowObject.validate(shallowObject)
})

console.time('superstruct - shallow object')
validateShallowObject.validate(shallowObject)
console.timeEnd('superstruct - shallow object')

// Deep Object
function generateDeepObject(levels, objToAdd = {}) {
  let temp = {}
  const obj = temp
  for (let i = 0; i < levels; i++) {
    if (i === levels - 1) temp.a = 'object'
    else temp.a = { ...objToAdd }
    temp = temp.a
  }
  return obj
}

const validateDeepObject = struct(generateDeepObject(config.deepObject.levels))

runFunctionManyTimes(config.runCount, () => validateDeepObject(deepObject))

console.time('superstruct - deep object')
validateDeepObject(deepObject)
console.timeEnd('superstruct - deep object')

// Array
const validateArray = struct({
  array: [{ foo: 'string' }],
})

runFunctionManyTimes(config.runCount, () => validateArray(array))

console.time('superstruct - array')
validateArray(array)

console.timeEnd('superstruct - array')

// Array Simple
const validateArraySimple = struct({
  array: ['string'],
})

runFunctionManyTimes(config.runCount, () => validateArraySimple(arraySimple))

console.time('superstruct - array simple')
validateArraySimple(arraySimple)

console.timeEnd('superstruct - array simple')
