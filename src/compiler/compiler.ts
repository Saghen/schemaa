import {
  IOption,
  IType,
  validationFunctionType,
  sanitizationFunctionType,
  defaultTypes,
} from '../types/types'
import { Keys, Sanitizers, PropertyName, Type, Validators } from '../symbols'
import { Schema } from '../index'

import { getType, isType } from '../types/helpers'
import { CompilationError } from '../errors'

// User

export interface IUserSchema {
  [key: string]: any
}

// Transpiled

export interface ITranspiledProperty {
  propertyName: string
  type: IType | [IType] | ITranspiledSchema
  options: {
    [key: string]: boolean | string
  }
}

export interface ITranspiledSchema {
  [key: string]: ITranspiledProperty
}

function transpileSchema(userSchema: IUserSchema): ITranspiledSchema {

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

export interface ICompiledProperty {
  propertyName: string
  type: IType | Schema
  options: {
    [Keys]: string[]
    [key: string]: boolean | string
  }
  validators: {
    [Keys]: string[]
    [key: string]: validationFunctionType
  }
  sanitizers: {
    [Keys]: string[]
    [key: string]: sanitizationFunctionType
  }
}

export interface ICompiledSchema {
  [Keys]: string[]
  [key: string]: ICompiledProperty
}

function compileSchema(schema: IUserSchema): ICompiledSchema {}
