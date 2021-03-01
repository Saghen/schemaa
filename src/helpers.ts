export function areArraysEqual(arr1, arr2) {
  return new Set([...arr1, ...arr2]).size === arr1.length
}
