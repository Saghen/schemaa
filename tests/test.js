const { Schema } = require('../dist')

const data = {
  hello: 'holy123',
  ja: 123,
  array: new Array(1000).fill("123"),
  another: '123',
  nested: {
    values: 'pogchamp'
  }
}

const validator = new Schema({
  hello: {
    type: String,
    minLength: 6
  },
  ja: Number,
  array: [String],
  another: String,
  nested: {
    values: Number
  }
})

console.log(validator.compiledSchema)
validator.validate(data)

/*const validatorDeep = new Validator({
  nested: { whatthefuck: string, innerArray: [string] },
})
validatorDeep.validate({
  nested: { whatthefuck: 'hello', innerArray: [''] }
})
console.log(validatorDeep)*/

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
