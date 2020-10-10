import { defaultTypes, IType } from './types'
import { IsGenerativeType, IsType } from '../symbols'

export function getType(type: IType) {
  if ([String, Boolean, Number, Function, Array, Object].includes(type))
    return defaultTypes[type.name.toLowerCase()]

  if (Object.values(defaultTypes).includes(type)) return type
}

export function isType(type: IType) {
  return Boolean(getType(type))
}

export function getTypeInfo(type: IType) {
  return {
    isType: type[IsType],
    isGenerativeType: type[IsGenerativeType],
    name: type.name,
    extends: type.extends,
  }
}
