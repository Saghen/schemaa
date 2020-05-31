const data = {
  hello: 'holy',
  ja: 123,
  array: new Array(1000).fill({ foo: '123' }),
  another: 123,
}

// TODO: Is it actually possible to beat AJV? And is it necessary at all lol
const Ajv = require('ajv')
const ajvValidator = new Ajv().compile({
  properties: {
    hello: { type: 'string' },
    ja: { type: 'number' },
    array: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          foo: { type: 'string' },
        },
      },
    },
  },
})

new Array(100).fill(0).forEach(() => {
  ajvValidator(data)
})

console.time('ajv')
ajvValidator(data)
console.timeEnd('ajv')
