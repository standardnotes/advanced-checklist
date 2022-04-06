export function arrayMoveMutable(
  array: any[],
  fromIndex: number,
  toIndex: number
) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex
  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex
    const [item] = array.splice(fromIndex, 1)
    array.splice(endIndex, 0, item)
  }
}

export function arrayMoveImmutable(
  array: any[],
  fromIndex: number,
  toIndex: number
) {
  array = [...array]
  arrayMoveMutable(array, fromIndex, toIndex)
  return array
}

export function getPercentage(numberA: number, numberB: number): number {
  if (numberA === 0 || numberB === 0) {
    return 0
  }
  const min = Math.min(numberA, numberB)
  const max = Math.max(numberA, numberB)
  const percentage = (min / max) * 100
  return Number(percentage.toFixed(2))
}
