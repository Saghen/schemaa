module.exports = {
  runFunctionManyTimes(times, func) {
    new Array(times).fill(0).forEach(func)
  },
}
