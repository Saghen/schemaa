import { ValidationFailure } from '../errors'
import { ICompiledProperty, ICompiledOptions } from '../compiler/compiler'
import { RequireOnlyOne } from '../utility-types'

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
  validate: validationFunctionType
  name: String
  extends?: String
}

export interface ITypes {
  [key: string]: IType
}

export const defaultTypes: ITypes = {
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
  function: {
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
