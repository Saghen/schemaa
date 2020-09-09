const { Validator, string, boolean, number, bigInt, func } = require('./src/index')

const data = {
  hello: 'holyaa',
  ja: 123,
  array: new Array(1000).fill({ foo: '123' }),
  another: '123',
}

const validator = new Validator({
  hello: {
    type: string,
    minLength: 6
  },
  ja: number,
  array: [{ foo: string }],
  another: string,
})

console.log(validator.compiledSchema)
validator.validate(data)

const validatorDeep = new Validator({
  nested: { whatthefuck: string, innerArray: [string] },
})
validatorDeep.validate({
  nested: { whatthefuck: 'hello', innerArray: [''] }
})
console.log(validatorDeep)

/*const validatorShallow = new Validator(string)
validatorShallow.validate('h')

const validatorShallow2 = new Validator({ type: string, length: 5 }, { name: 'Name' })
console.log(validatorShallow2)
validatorShallow2.validate('12345')

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
console.timeEnd()*/
