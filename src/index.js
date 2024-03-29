const { ValidationError, REASONS } = require('./errors')
const { typeDefinitions, typeOptions } = require('./types')
const { createFailure, wrapIfLiteral } = require('./helpers')

const reservedKeywords = ['type', 'middleware', 'name', 'required']
const types = Object.values(typeDefinitions)

function getAllTypeOptions(type) {
  // Handle arrays and nested objects
  if (Array.isArray(type)) type = typeDefinitions.array
  else if (type instanceof Validator) type = typeDefinitions.object

  let previousType = type
  let currentType = type
  let propertyTypeOptions = typeOptions[type.name]
  while (currentType.extends) {
    currentType = types.find((type) => type.name === currentType.extends)
    if (!currentType)
      throw new Error(
        `The type ${previousType.name} requested ${previousType.extends} but the type does not exist`
      )
    propertyTypeOptions = { ...typeOptions[currentType.name], ...propertyTypeOptions }
    previousType = currentType
  }
  return propertyTypeOptions
}

function parseOptions(propertySchema) {
  const middleware = []
  const dependsOn = new Set()

  const propertyTypeOptions = getAllTypeOptions(propertySchema.type)
  const propertyOptions = Object.keys(propertySchema).filter(
    (key) => !reservedKeywords.includes(key)
  )

  for (const key of propertyOptions) {
    const typeOption = propertyTypeOptions[key]
    if (!typeOption)
      throw new Error(`The provided option ${key} was not found on the key ${propertySchema.name}`)

    // Consistently make all options a function
    // FIXME: We've abstracted this away so it's no longer necessary
    propertySchema[key] = wrapIfLiteral(propertySchema[key])

    if (!Array.isArray(typeOption.dependsOn)) typeOption.dependsOn = [key]
    for (const dependsOnKey of typeOption.dependsOn) {
      if (!propertyOptions.includes(dependsOnKey))
        throw new Error(
          `The option ${key} depends on the option ${dependsOnKey} to be defined as well`
        )

      dependsOn.add(dependsOnKey)
    }
    middleware.push(typeOption)
  }
  return { middleware, dependsOn: Array.from(dependsOn) }
}

function compileSchema(schema) {
  const compiledSchema = {}
  if (types.includes(schema) || types.includes(schema.type) || Array.isArray(schema)) {
    let propertySchema = schema
    if (!types.includes(propertySchema.type) && !(propertySchema.type instanceof Validator))
      propertySchema = { type: schema }

    if (typeof propertySchema.type !== 'object') throw new Error('The type must be an object')

    const { middleware, dependsOn } = parseOptions(propertySchema)
    propertySchema._middleware = middleware
    propertySchema._dependsOn = dependsOn
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
    // TODO: Make into reusable function
    if (!types.includes(propertySchema.type) && !(propertySchema.type instanceof Validator))
      propertySchema = {
        type: value,
      }

    const isValidator = propertySchema.type instanceof Validator
    const isArray = Array.isArray(propertySchema.type) && !isValidator
    const isNested = !types.includes(propertySchema.type) && !isArray && !isValidator

    if (isNested) propertySchema.type = new Validator(value)

    const { middleware, dependsOn } = parseOptions(propertySchema)
    propertySchema._middleware = middleware
    propertySchema._dependsOn = dependsOn
    propertySchema.name = propertySchema.name || key

    if (isArray) {
      let arraySchema = propertySchema.type[0]
      if (!types.includes(propertySchema.type) && !(propertySchema.type instanceof Validator))
        arraySchema = {
          type: arraySchema,
          name: `Child of ${propertySchema.name}`,
        }
      propertySchema.type = [
        {
          type: new Validator(arraySchema.type, { name: arraySchema.name }),
        },
      ]
    }

    compiledSchema[key] = propertySchema
  }
  return compiledSchema
}

class Validator {
  compiledSchema = {}
  constructor(schema, { strict = true, name } = {}) {
    this.compiledSchema = compileSchema(schema)
    this.strict = strict
    this.name = name || (this.compiledSchema.isShallow ? 'Property' : 'Object')
    if (this.compiledSchema.isShallow) this.compiledSchema.name = this.name
  }

  validate(obj, fullObj = obj) {
    const failures = []
    if (this.compiledSchema.isShallow) {
      failures.push(...this.validateProperty(undefined, this.compiledSchema, obj, fullObj))
    } else
      for (const [key, property] of Object.entries(this.compiledSchema)) {
        const toValidate = obj[key]
        failures.push(...this.validateProperty(key, property, toValidate, obj, fullObj))
      }

    if (failures.length > 0)
      throw new ValidationError({
        failures,
        object: obj,
        message: 'There were errors while validating the object',
      })
  }

  validateProperty(key, property, toValidate, obj, fullObj) {
    const failures = []

    const isRequired = (typeof property.required === 'function' ? property.required() : property.required) ?? this.strict
    const isArray = Array.isArray(property.type)
    const isNested = property.type instanceof Validator

    // Handle undefined values
    if (toValidate === undefined || toValidate === null) {
      let message = isArray
        ? `${property.name} is required and must be an array of ${property.type[0].name}s`
        : `${property.name} is required and must be of type ${property.type.name}`

      if (isRequired)
        failures.push(
          createFailure({
            key,
            value: toValidate,
            message,
            reason: REASONS.REQUIRED,
          })
        )
      return failures
    }

    // Handle nested objects
    if (isNested) {
      try {
        property.type.validate(toValidate, fullObj)
      } catch (err) {
        for (const failure of err.failures) {
          failure.path.push(key)
        }
        failures.push(...err.failures)
      }
    }

    // Handle arrays
    else if (isArray) {
      if (!Array.isArray(toValidate)) {
        if (isRequired)
          failures.push(
            createFailure({
              key,
              value: toValidate,
              message: `${property.name} must be an array`,
              reason: REASONS.INVALID_TYPE,
            })
          )
        return failures
      }

      for (let i = 0; i < toValidate.length; i++) {
        try {
          property.type[0].type.validate(toValidate[i], fullObj)
        } catch (err) {
          if (!(err instanceof ValidationError)) throw err
          for (const failure of err.failures) {
            failure.index = i
            if (failure.path) failure.path.push(key)
          }
          failures.push(...err.failures)
          break
        }
      }
    }

    // Handle regular types
    else if (!property.type.validate.bind(fullObj)(toValidate, obj)) {
      // Type was invalid so we return the failure
      failures.push(
        createFailure({
          key,
          value: toValidate,
          message: `${property.name} must be of type ${property.type.name}`,
          reason: REASONS.INVALID_TYPE,
        })
      )
    }

    // Type is valid so we run the middleware
    if (failures.length === 0) {
      if (property._middleware.length === 0) return failures
      const propertyClone = {
        ...property,
      }
      // Get all required values
      for (const dependsOnKey of property._dependsOn)
        propertyClone[dependsOnKey] = property[dependsOnKey](toValidate, obj, {
          fullObj,
        })

      // Loop through middleware
      for (let i = 0; i < property._middleware.length; i++) {
        const middlewareArgs = [
          toValidate,
          propertyClone,
          {
            obj,
            fullObj,
            fullSchema: this.compiledSchema,
          },
        ]
        // FIXME: Need to pass outer compiled schema
        if (property._middleware[i].validate(...middlewareArgs)) continue
        const message =
          property._middleware[i].message?.(...middlewareArgs) ?? `${property.name} is invalid`
        const reason = property._middleware[i].reason?.(...middlewareArgs) ?? REASONS.INVALID
        failures.push(
          createFailure({
            key,
            value: toValidate,
            message,
            reason,
          })
        )
      }
    }

    return failures
  }
}

module.exports = { Validator, ...typeDefinitions }
