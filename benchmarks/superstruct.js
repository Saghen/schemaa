const { struct } = require('superstruct')
const validasdad = struct({
  hello: 'string',
  ja: 'number',
  array: [{ foo: 'string' }],
  another: 'number',
})

new Array(100).fill(0).forEach(() => {
  try {
    validasdad(data)
  } catch (err) {}
})

console.time('superstruct')
try {
  validasdad(data)
} catch (err) {}

console.timeEnd('superstruct')
