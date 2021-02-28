export class ValidationFailure {
  value: any
  message: string
  reason: FAILURE_REASONS
  path: Array<string>
  key?: string
  index?: number
  constructor({ value, message, reason, path, key, index }: ValidationFailure) {
    this.value = value
    this.message = message
    this.reason = reason
    this.path = path
    this.key = key
    this.index = index
  }
}

export class ValidationError extends Error {
  failures: Array<ValidationFailure>
  message: string
  constructor({ failures, message }: Pick<ValidationError, 'failures' | 'message'>) {
    super()
    this.name = 'ValidationError'
    this.failures = failures
    this.message = message
  }
}

export class CompilationError extends Error {
  message: string
  constructor(message: string) {
    super()
    this.name = 'CompilationError'
    this.message = message
  }
}

export enum FAILURE_REASONS {
  REQUIRED = 'required',
  INVALID_TYPE = 'invalid-type',
  INVALID = 'invalid',
}
