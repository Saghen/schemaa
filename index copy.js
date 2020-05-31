const { ValidationError } = require('./errors')
const { string, boolean, number, bigInt, func } = require('./types')

const types = [string, boolean, number, bigInt, func]

const REASONS = {
  REQUIRED: 0,
  INVALID_TYPE: 1,
}

function addCustomType(type) {
  if (typeof type.validator !== 'function')
    throw new Error('The custom type must have a validator function')
  if (typeof type.name !== 'string')
    throw new Error('The custom type must have a name string')
  types.push(type)
}

function addReason(key) {
  REASONS[key] = ++Math.max(...Object.values(REASONS))
}

function compileSchema(schema) {
  const compiledSchema = {}
  if (
    types.includes(schema) ||
    types.includes(schema.type) ||
    Array.isArray(schema)
  ) {
    let propertySchema = schema
    if (types.includes(propertySchema) || Array.isArray(propertySchema))
      propertySchema = { type: schema }

    propertySchema.name = propertySchema.name || 'Property'

    if (Array.isArray(propertySchema.type)) {
      propertySchema.type = [new Validator(propertySchema.type[0])]
    }

    propertySchema.isShallow = true

    return propertySchema
  }
  for (const [key, value] of Object.entries(schema)) {
    let propertySchema = value

    // Convert to a consistent format
    if (types.includes(propertySchema) || Array.isArray(propertySchema))
      propertySchema = { type: value }

    // The name is used for error messages
    propertySchema.name = propertySchema.name || key

    if (Array.isArray(propertySchema.type)) {
      propertySchema.type = [new Validator(propertySchema.type[0])]
    }

    if (!propertySchema.type) compiledSchema[key] = new Validator(value)

    compiledSchema[key] = propertySchema
  }
  return compiledSchema
}

class Validator {
  compiledSchema = {}
  schema = {}
  constructor(schema, { strict = true } = {}) {
    this.schema = schema
    this.compiledSchema = compileSchema(schema)
    this.strict = strict
  }

  validate(obj, fullObj = obj) {
    const failures = []
    if (this.compiledSchema.isShallow) {
      if (Array.isArray(this.compiledSchema.type)) {
        if (!Array.isArray(obj))
          failures.push({
            key,
            path: [key],
            value: toValidate,
            message: `${this.compiledSchema.name} is required and must be an array of ${this.compiledSchema.type[0].name}`,
            reasonEnum: 'REQUIRED',
            reason: REASONS.REQUIRED,
          })
        for (let i = 0; i < toValidate.length; i++)
          this.compiledSchema.type[0].validate(toValidate[i], fullObj)
      } else {
        if (!this.compiledSchema.type.validator.bind(fullObj)(obj, fullObj))
          failures.push({
            value: obj,
            message: `${this.compiledSchema.name} must be of type ${this.compiledSchema.type.name}`,
            reasonEnum: 'INVALIDTYPE',
            reason: REASONS.INVALID_TYPE,
          })
      }
      if (failures.length > 0)
        throw new ValidationError({
          failures,
          object: obj,
          message: 'There were errors while validating the object',
        })
      return
    }
    for (const [key, property] of Object.entries(this.compiledSchema)) {
      const toValidate = obj[key]

      // Handle undefined values
      if (toValidate === undefined || toValidate === null) {
        const isRequired =
          typeof property.required === 'function'
            ? property.required.bind(fullObj)(toValidate, obj)
            : property.required
        if (this.strict || isRequired)
          failures.push({
            key,
            path: [key],
            value: toValidate,
            message: `${property.name} is required and must be of type ${property.type.name}`,
            reasonEnum: 'REQUIRED',
            reason: REASONS.REQUIRED,
          })
        continue
      }

      // Handle nested objects
      if (property instanceof Validator) {
        try {
          property.validate(toValidate, fullObj)
        } catch (err) {
          for (const failure of err.failures) {
            failure.path.push(key)
          }
          failures.push(...err.failures)
        }
        continue
      }

      // Handle arrays
      if (Array.isArray(property.type)) {
        if (!Array.isArray(toValidate) && isRequired)
          failures.push({
            key,
            path: [key],
            value: toValidate,
            message: `${property.name} is required and must be an array of ${property.type[0].name}`,
            reasonEnum: 'REQUIRED',
            reason: REASONS.REQUIRED,
          })
        ArrayLoop: for (let i = 0; i < toValidate.length; i++) {
          try {
            property.type[0].validate(toValidate[i], fullObj)
          } catch (err) {
            for (const failure of err.failures) {
              failure.index = i
              failure.path.push(key)
            }
            failures.push(...err.failures)
            break ArrayLoop
          }
        }
        continue
      }

      // Handle regular values
      else if (!property.type.validator.bind(fullObj)(toValidate, obj))
        failures.push({
          key,
          path: [key],
          value: toValidate,
          message: `${property.name} must be of type ${property.type.name}`,
          reasonEnum: 'INVALIDTYPE',
          reason: REASONS.INVALID_TYPE,
        })
    }

    if (failures.length > 0)
      throw new ValidationError({
        failures,
        object: obj,
        message: 'There were errors while validating the object',
      })
  }

  validateProperty() {

  }
}

module.exports = Validator
