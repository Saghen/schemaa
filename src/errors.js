const REASONS = {
  REQUIRED: 0,
  INVALID_TYPE: 1,
  INVALID: 2,
  getKey(value) {
    const entry = Object.entries(REASONS).find((a) => a[1] === value)
    if (!entry) return
    return entry[0]
  },
}

Object.defineProperty(REASONS, 'getKey', {
  enumerable: false,
})

class ValidationError extends Error {
  constructor({ failures, message }) {
    super()
    this.name = 'ValidationError'
    this.failures = failures
    this.message = message
  }
}

module.exports = { ValidationError, REASONS }
