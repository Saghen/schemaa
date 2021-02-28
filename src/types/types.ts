import { CompilationError, FAILURE_REASONS, ValidationError, ValidationFailure } from '../errors'
import { ICompiledProperty, ICompiledOptions } from '../compiler/compiler'
import { RequireOnlyOne } from '../utility-types'
import { IsType, IsGenerativeType } from '../symbols'

export type validationFunctionType = (
  prop: any,
  options: ICompiledOptions,
  schema: ICompiledProperty
) => boolean | string | ValidationFailure

export type sanitizationFunctionType = <T>(
  prop: T,
  options: ICompiledOptions,
  schema: ICompiledProperty
) => T

// Types
export interface IType {
  validate: (prop: any) => boolean | ValidationFailure
  name: string
  extends?: string
  [IsType]: true
  [IsGenerativeType]?: boolean
}

export interface ITypes {
  [key: string]: IType
}

export const defaultTypes: ITypes = {
  any: {
    validate: () => true,
    name: 'any',
    [IsType]: true,
  },
  string: {
    validate: (prop) => typeof prop === 'string' || prop instanceof String,
    name: 'string',
    extends: 'any',
    [IsType]: true,
  },
  boolean: {
    validate: (prop) => typeof prop === 'boolean' || prop instanceof Boolean,
    name: 'boolean',
    extends: 'any',
    [IsType]: true,
  },
  number: {
    validate: (prop) => typeof prop === 'number' || prop instanceof Number,
    name: 'number',
    extends: 'any',
    [IsType]: true,
  },
  function: {
    validate: (prop) => typeof prop === 'function',
    name: 'function',
    extends: 'any',
    [IsType]: true,
  },
  object: {
    validate: (prop) => typeof prop === 'object' && prop !== null,
    name: 'object',
    extends: 'any',
    [IsType]: true,
  },
}

// Generative Types
export type generativeTypeFunction = (...args) => IType

export interface IGenerativeTypeFunctions {
  [key: string]: generativeTypeFunction
}

export const defaultGenerativeTypeFunctions: IGenerativeTypeFunctions = {
  array: (innerType: IType) => ({
    validate: (prop) => {
      if (!Array.isArray(prop)) return false
      for (let i = 0; i < prop.length; i++) {
        try {
          if (innerType.validate(prop[i])) continue
          throw new ValidationFailure({
            value: prop[i],
            message: `Value at index ${i} is not of type ${innerType.name}`,
            index: i,
            path: [],
            reason: FAILURE_REASONS.INVALID_TYPE,
          })
        } catch (err) {
          if (err instanceof ValidationFailure) err.index = i
          if (err instanceof ValidationError)
            err.failures = err.failures.map((failure) => {
              failure.index = i
              return failure
            })
          throw err
        }
      }
      return true
    },
    name: 'array',
    extends: 'any',
    [IsType]: true,
    [IsGenerativeType]: true,
  }),
}

// Options
interface IOptionAll {
  validate: validationFunctionType
  sanitize: sanitizationFunctionType
}

export type IOption = RequireOnlyOne<IOptionAll, 'validate' | 'sanitize'>

export interface IOptions {
  [key: string]: {
    [key: string]: IOption
  }
}

export const defaultOptions: IOptions = {
  any: {
    // TODO: Fix for anything that is passed by reference (Array, Object)
    value: {
      validate: (prop, { value }, { propertyName }) =>
        prop === value || `${propertyName} must be equal to ${value}`,
    },
    enums: {
      validate: (prop, { enums }, { propertyName }) =>
        (<any[]>enums).includes(prop)
          ? true
          : `${propertyName} must be one of the following enumerators: ${enums.join(', ')}`,
    },
  },
  string: {
    length: {
      validate: (prop, { length }, { propertyName }) =>
        prop.length === length || `${propertyName} must be ${length} characters`,
    },
    maxLength: {
      validate: (prop, { maxLength }, { propertyName }) =>
        prop.length <= maxLength
          ? true
          : `${propertyName} must be less than or equal to ${maxLength} characters`,
    },
    minLength: {
      validate: (prop, { minLength }, { propertyName }) =>
        prop.length >= minLength
          ? true
          : `${propertyName} must be greater than or equal to ${minLength} characters`,
    },
  },
  number: {
    max: {
      validate: (prop, { max }, { propertyName }) =>
        prop <= max || `${propertyName} must be less than or equal to ${max}`,
    },
    min: {
      validate: (prop, { min }, { propertyName }) =>
        prop >= min || `${propertyName} must be greater than or equal to ${min}`,
    },
  },
  array: {},
  object: {},
}
