import {
  IOption,
  IType,
  validationFunctionType,
  sanitizationFunctionType,
  defaultTypes,
  defaultGenerativeTypeFunctions,
} from '../types/types'
import { Keys } from '../symbols'
import { Schema } from '../index'

import { getType, getTypeOptions, isType } from '../types/helpers'
import { CompilationError } from '../errors'

// User
export interface IUserSchema {
  [key: string]: any
}

// Transpiled
export interface ITranspiledOptions {
  [key: string]: any
}

export interface ITranspiledProperty {
  propertyName: string
  type: IType | [IType] | ITranspiledSchema
  options: ITranspiledOptions
}

export interface ITranspiledSchema {
  [key: string]: ITranspiledProperty
}

export function transpileSchema(userSchema: IUserSchema): ITranspiledSchema {
  const transpiledSchema: ITranspiledSchema = {}

  for (const [key, value] of Object.entries(userSchema))
    transpiledSchema[key] = transpileProperty(key, value)

  return transpiledSchema
}

export function transpileProperty(key: string, property: any): ITranspiledProperty {
  if (property === undefined || property === null)
    throw new CompilationError(`The property to compile cannot be undefined or null`)

  if (isType(property)) return { propertyName: key, type: getType(property), options: {} }

  if (typeof property !== 'object')
    throw new CompilationError(`The property to compile must be a valid type or an object`)

  if (isType(property.type))
    return {
      propertyName: property.name || key,
      type: getType(property.type),
      options: { ...property },
    }

  return { propertyName: key, type: property, options: {} }
}

// Compiled
export interface ICompiledValidators {
  [Keys]: string[]
  [key: string]: validationFunctionType
}

export interface ICompiledSanitizers {
  [Keys]: string[]
  [key: string]: sanitizationFunctionType
}

export interface ICompiledOptions {
  [Keys]: string[]
  [key: string]: any
}

export interface ICompiledProperty {
  propertyName: string
  type: IType | Schema
  options: ICompiledOptions
  validators: ICompiledValidators
  sanitizers: ICompiledSanitizers
}

export interface ICompiledSchema {
  [Keys]: string[]
  [key: string]: ICompiledProperty
}

export function compileSchema(transpiledSchema: ITranspiledSchema): ICompiledSchema {
  const compiledSchema: ICompiledSchema = {
    [Keys]: Object.keys(transpiledSchema),
  }

  for (const [key, value] of Object.entries(transpiledSchema))
    compiledSchema[key] = compileProperty(key, value)

  return compiledSchema
}

export function compileProperty(key: string, property: ITranspiledProperty): ICompiledProperty {
  const compiledProperty: Partial<ICompiledProperty> = {
    propertyName: property.propertyName,
    options: { [Keys]: Object.keys(property.options), ...property.options },
    validators: { [Keys]: [] },
    sanitizers: { [Keys]: [] },
  }

  if (Array.isArray(property.type)) {
    compiledProperty.type = defaultGenerativeTypeFunctions.array(
      isType(property.type[0]) ? property.type[0] : new Schema(property.type[0])
    )
  } else if (isType(property.type)) compiledProperty.type = property.type as IType
  else compiledProperty.type = new Schema(property.type as ITranspiledSchema)

  if (!isType(compiledProperty.type)) return compiledProperty as ICompiledProperty

  // Add options
  const type = compiledProperty.type as IType
  const typeOptions = getTypeOptions(type)

  for (const optionName of Object.keys(property.options)) {
    if (optionName === 'type' || optionName === 'optional') continue

    const option = typeOptions[optionName]
    if (!option)
      throw new CompilationError(`Option named ${optionName} was not found on type ${type.name}`)

    if (option.validate) {
      compiledProperty.validators[Keys].push(optionName)
      compiledProperty.validators[optionName] = option.validate
    }

    if (option.sanitize) {
      compiledProperty.sanitizers[Keys].push(optionName)
      compiledProperty.sanitizers[optionName] = option.sanitize
    }
  }

  return compiledProperty as ICompiledProperty
}
