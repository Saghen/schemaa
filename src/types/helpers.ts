import { defaultTypes } from './types'

export function getType(type) {
  if ([String, Boolean, Number, Function, Array, Object].includes(type))
    return defaultTypes[type.name.toLowerCase()]

  if (Object.values(defaultTypes).includes(type)) return type
}

export function isType(type) {
  return !!getType(type)
}
