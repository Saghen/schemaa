import {
  IOption,
  IType,
  validationFunctionType,
  sanitizationFunctionType,
  defaultTypes,
} from '../types/types'
import { Keys, Sanitizers, PropertyName, Type, Validators, IsShallow } from '../symbols'
import { Schema } from '../index'

import { getType, isType } from '../types/helpers'
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

function transpileSchema(userSchema: IUserSchema): ITranspiledSchema {
  const transpiledSchema: ITranspiledSchema = {}

  for (const [key, value] of Object.entries(userSchema))
    transpiledSchema[key] = transpileProperty(key, value)

  return transpiledSchema
}

function transpileProperty(key: string, property: any): ITranspiledProperty {
  if (property === undefined || property === null)
    throw new CompilationError(`The property to compile cannot be undefined or null`)

  if (isType(property)) return { propertyName: key, type: getType(property), options: {} }

  if (typeof property !== 'object')
    throw new CompilationError(`The property to compile must be a valid type or an object`)

  if (isType(property.type))
    return { propertyName: property.name || key, type: property.type, options: { ...property } }

  return { propertyName: key, type: transpileSchema(property), options: {} }
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

function compileSchema(schema: IUserSchema): ICompiledSchema {}

function compileProperty(key: string, property: ITranspiledProperty): ICompiledProperty {}
