const string = {
  validate: (prop) => typeof prop === 'string' || prop instanceof String,
  name: 'string',
  extends: 'string'
}
const boolean = {
  validate: (prop) => typeof prop === 'boolean' || prop instanceof Boolean,
  name: 'boolean',
  extends: 'boolean',
}
const number = {
  validate: (prop) => typeof prop === 'number' || prop instanceof Number,
  name: 'number',
  extends: 'number',
}
const bigInt = {
  validate: (prop) => typeof prop === 'bigint' || prop instanceof BigInt,
  name: 'bigint',
  extends: 'bigint',
}
const func = {
  validate: (prop) => typeof prop === 'function',
  name: 'function',
  extends: 'function',
}

const { REASONS } = require('./errors')

const exampleOptionFunction = (prop, obj, { fullObj }) => 2

const exampleFullSizeOption = {
  requires: ['a', 'list', 'of', 'all', 'the', 'options', 'required'], // Defaults to the key
  validate: (prop, schema, { obj, fullSchema, fullObj }) => true || false,
  message: (prop, schema, { obj, fullSchema, fullObj }) => 'message',
  reason: (prop, schema, { obj, fullSchema, fullObj }) => REASONS.INVALID,
}

const allTypeOptions = {
  string: {
    length: {
      validate: (prop, { length }) => prop.length === length,
      message: (prop, { name, length }) => `${name} must be ${length} characters`,
    },
    maxLength: {
      validate: ({ maxLength }, prop) => prop.length <= maxLength,
      message: ({ maxLength, name }, prop) =>
        `${name} must be less than or equal to ${maxLength} characters`,
    },
    minLength: {
      validate: ({ minLength }, prop) => prop.length >= minLength,
      message: ({ minLength, name }, prop) =>
        `${name} must be greater than or equal to ${minLength} characters`,
    },
    enums: {
      validate: ({ enums }, prop) => enums.includes(prop),
      message: ({ enums }, { name }) =>
        `${name} must be one of the following enumerators: ${enums.join(', ')}`,
    },
  },
}

module.exports = { string, boolean, number, bigInt, func, allTypeOptions }
