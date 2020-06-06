import { IType } from './types'
import { ISchema } from './index'
import { ValidationFailure } from './errors'

export interface IOption {
  validate?(prop: any, schema: ICompiledProperty): boolean | string | ValidationFailure
  sanitizer?<T>(prop: T, schema: ICompiledProperty): T
}

export interface ICompiledProperty {
  type: IType | ISchema | [IType]
  _middleware: Array<IOption>
  name: string
}
