import { defaultOptions, defaultTypes, IType } from './types'
import { IsGenerativeType, IsType } from '../symbols'

export function getType(type: any): IType | [IType] | undefined {
  if ([String, Boolean, Number, Function, Array, Object].includes(type))
    return defaultTypes[type.name.toLowerCase()]

  if (Array.isArray(type)) return [isType(type[0]) ? getType(type[0]) : type[0]]

  if (Object.values(defaultTypes).includes(type)) return type
}

export function isType(type: any) {
  if (type === undefined || type === null) return false
  return Boolean(type[IsType] || [String, Boolean, Number, Function, Array, Object].includes(type) || Array.isArray(type))
}

export function getTypeInfo(type: IType) {
  return {
    isType: type[IsType],
    isGenerativeType: type[IsGenerativeType],
    name: type.name,
    extends: type.extends,
  }
}

export function getTypeOptions(type: IType) {
  return defaultOptions[type.name]
}
