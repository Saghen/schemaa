import { ICompiledProperty } from './compiler'

export interface ISchema {
  compiledSchema: {
    [key: string]: ICompiledProperty
  }
  validator(): void
}
