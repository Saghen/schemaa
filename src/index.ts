import { ICompiledProperty } from './compiler/compiler'
import { Keys } from './symbols'



export class Schema {
  compiledSchema: CompiledSchema = {
    [Keys]: []
  }
  constructor() {
    for (const key of this.compiledSchema[Keys]) {

    }
  }
  validate<T>(prop: T): T {}
}
