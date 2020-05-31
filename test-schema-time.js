const Validator = require('./index')
const { string, boolean, number, bigInt, func } = require('./types')

const data = {
  hello: 'holy',
  ja: 123,
  array: new Array(1000).fill({ foo: '123' }),
  another: 123,
}

const validator = new Validator({
  hello: string,
  ja: number,
  array: [{ foo: { type: string, length: 3 } }],
  another: string,
})

new Array(100).fill(0).forEach(() => {
  try {
    validator.validate(data)
  } catch (err) {}
})

console.time('schemaa')
try {
  validator.validate(data)
} catch (err) {}

console.timeEnd('schemaa')
