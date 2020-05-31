const { REASONS } = require('./errors')

function wrapIfLiteral(possibleLiteral) {
  if (typeof possibleLiteral !== 'function') return () => possibleLiteral
  return possibleLiteral
}

function createFailure({ key, value, message, reason, index }) {
  const failure = { value, message, reasonEnum: REASONS.getKey(reason), reason, path: [] }
  if (key) {
    failure.key = key
    failure.path.push(key)
  }
  if (index) {
    failure.index = index
  }
  return failure
}

module.exports = { wrapIfLiteral, createFailure }
