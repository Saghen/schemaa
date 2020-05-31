const Validator = require('./index')
const { string, boolean, number, bigInt, func } = require('./types')

const data = {
  hello: 'holy',
  ja: 123,
  array: new Array(1000).fill({ foo: '123' }),
  another: '123',
}

const validator = new Validator({
  hello: {
    type: string,
    length: 6
  },
  ja: number,
  array: [{ foo: string }],
  another: string,
})

validator.validate(data)

const validatorDeep = new Validator({
  hello: string,
  nested: { whatthefuck: string, innerArray: [string] },
  type: { type: string },
})
validatorDeep.validate({
  hello: '12',
  nested: { whatthefuck: 'hello', innerArray: [''] },
  type: 'ja',
})

const validatorShallow = new Validator(string)
validatorShallow.validate('h')

const validatorShallow2 = new Validator({ type: string, length: 5 }, { name: 'Name' })
console.log(validatorShallow2)
validatorShallow2.validate('12')

console.time()
const aBigBoi = new Validator({
  prop: string,
  prop2: string,
  prop3: {
    hello: string,
    array: [{ holy: number, mother: boolean, ofGod: func }],
    wowowow: number
  },
  prop4: {
    type: boolean
  }
})
console.timeEnd()
