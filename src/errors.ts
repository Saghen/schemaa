export class ValidationFailure {
  value: any
  message: string
  reasonEnum: string
  reason: number
  path: Array<string>
  key?: string
  index?: number
  constructor({ value, message, reasonEnum, reason, path, key, index }: ValidationFailure) {
    this.value = value
    this.message = message
    this.reasonEnum = reasonEnum
    this.reason = reason
    this.path = path
    this.key = key
    this.index = index
  }
}

export class ValidationError extends Error {
  failures: Array<ValidationFailure>
  message: string
  constructor({ failures, message }: ValidationError) {
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
    this.name = 'ValidationError'
    this.message = message
  }
}
