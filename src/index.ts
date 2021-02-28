import {
  compileSchema,
  transpileSchema,
  ICompiledSchema,
  ITranspiledSchema,
} from './compiler/compiler'
import { FAILURE_REASONS, ValidationError, ValidationFailure } from './errors'
import { Keys } from './symbols'
import { IType } from './types/types'

export class Schema {
  compiledSchema: ICompiledSchema
  transpiledSchema: ITranspiledSchema
  constructor(schema) {
    this.transpiledSchema = transpileSchema(schema)
    this.compiledSchema = compileSchema(this.transpiledSchema)
  }
  validate(props): true {
    const failures: ValidationFailure[] = []

    if (typeof props !== 'object' || props === null) throw new ValidationError({
      failures: [
        new ValidationFailure({
          value: props,
          message: `Value is not of type object`,
          path: [],
          reason: FAILURE_REASONS.INVALID_TYPE,
        }),
      ],
      message: `Failed validation`,
    })

    for (const key of this.compiledSchema[Keys]) {
      const prop = props[key]
      const compiledProperty = this.compiledSchema[key]

      // Nested objects are passed as classes so we handle that here
      try {
        const validationResult = compiledProperty.type.validate(prop)
        if (!validationResult) {
          failures.push(
            new ValidationFailure({
              value: prop,
              message: `${compiledProperty.propertyName} is not of type ${
                (compiledProperty.type as IType).name
              }`,
              path: [key],
              key,
              reason: FAILURE_REASONS.INVALID_TYPE,
            })
          )
          continue
        }
      } catch (err) {
        if (err instanceof ValidationFailure)
          err = new ValidationError({ failures: [err], message: 'Failed validation' })
        if (!(err instanceof ValidationError)) throw err

        // Append the key as we bubble up
        for (const failure of err.failures) failure.path.unshift(key)
        throw err
      }

      if (compiledProperty.type instanceof Schema) continue

      // Option validators
      for (const validatorKey of compiledProperty.validators[Keys]) {
        const validationResult = compiledProperty.validators[validatorKey](
          prop,
          compiledProperty.options,
          compiledProperty
        )
        if (validationResult === true) continue

        if (validationResult instanceof ValidationFailure) failures.push(validationResult)
        else
          failures.push({
            value: prop,
            message:
              validationResult === false
                ? `${compiledProperty.propertyName} did not pass the validator "${validatorKey}"`
                : validationResult,
            path: [key],
            key,
            reason: FAILURE_REASONS.INVALID,
          })
        break
      }
    }

    if (failures.length > 0) throw new ValidationError({ failures, message: `Failed validation` })

    return true
  }

  sanitize(props) {}
}
