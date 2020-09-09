const typeDefinitions = {
  any: {
    validate: () => true,
    name: 'any',
  },
  string: {
    validate: (prop) => typeof prop === 'string' || prop instanceof String,
    name: 'string',
    extends: 'any',
  },
  boolean: {
    validate: (prop) => typeof prop === 'boolean' || prop instanceof Boolean,
    name: 'boolean',
    extends: 'any',
  },
  number: {
    validate: (prop) => typeof prop === 'number' || prop instanceof Number,
    name: 'number',
    extends: 'any',
  },
  bigInt: {
    validate: (prop) => typeof prop === 'bigint' || prop instanceof BigInt,
    name: 'bigint',
    extends: 'any',
  },
  func: {
    validate: (prop) => typeof prop === 'function',
    name: 'function',
    extends: 'any',
  },
  array: {
    validate: (prop) => Array.isArray(prop),
    name: 'array',
    extends: 'any',
  },
  object: {
    validate: (prop) => typeof prop === 'object' && prop !== null,
    name: 'object',
    extends: 'any',
  },
}

const { REASONS } = require('./errors')

const exampleOptionFunction = (prop, obj, { fullObj }) => 2

const exampleFullSizeOption = {
  requires: ['a', 'list', 'of', 'all', 'the', 'options', 'required'], // Defaults to the key
  validate: (prop, schema, { obj, fullSchema, fullObj }) => true || false,
  message: (prop, schema, { obj, fullSchema, fullObj }) => 'message',
  reason: (prop, schema, { obj, fullSchema, fullObj }) => REASONS.INVALID,
}

const typeOptions = {
  any: {
    // TODO: Fix for anything that is passed by reference (Array, Object)
    value: {
      validate: (prop, { value }) => prop === value,
      message: (prop, { value, name }) => `${name} must be equal to ${value}`,
    },
    enums: {
      validate: (prop, { enums }) => enums.includes(prop),
      message: (prop, { enums, name }) =>
        `${name} must be one of the following enumerators: ${enums.join(', ')}`,
    },
  },
  string: {
    length: {
      validate: (prop, { length }) => prop.length === length,
      message: (prop, { name, length }) => `${name} must be ${length} characters`,
    },
    maxLength: {
      validate: (prop, { maxLength }) => prop.length <= maxLength,
      message: (prop, { maxLength, name }) =>
        `${name} must be less than or equal to ${maxLength} characters`,
    },
    minLength: {
      validate: (prop, { minLength }) => prop.length >= minLength,
      message: (prop, { minLength, name }) =>
        `${name} must be greater than or equal to ${minLength} characters`,
    },
  },
  number: {
    max: {
      validate: (prop, { max }) => prop <= max,
      message: (prop, { max, name }) => `${name} must be less than or equal to ${max}`,
    },
    min: {
      validate: (prop, { min }) => prop >= min,
      message: (prop, { min, name }) => `${name} must be greater than or equal to ${min}`,
    },
  },
  array: {},
  object: {},
}

module.exports = { typeDefinitions, typeOptions }
