const config = require('./config')

function generateDeepObject(levels, objToAdd = {}) {
  let temp = {}
  const obj = temp
  for (let i = 0; i < levels; i++) {
    temp.a = { ...objToAdd }
    temp = temp.a
  }
  return obj
}

function generateShallowObject(count, valueToAdd) {
  let obj = {}
  for (let i = 0; i < count; i++) {
    obj[i] = valueToAdd ?? i
  }
  return obj
}

module.exports = {
  array: {
    array: new Array(config.array.count).fill(0).map((val, i) => ({ foo: `${i}` })),
  },
  arraySimple: {
    array: new Array(config.array.count).fill('123'),
  },
  deepObject: generateDeepObject(config.deepObject.levels),
  shallowObject: generateShallowObject(config.shallowObject.count),
  largeObject: generateShallowObject(config.shallowObject.count, generateDeepObject(config.deepObject.levels)),
  generateDeepObject,
  generateShallowObject,
}
