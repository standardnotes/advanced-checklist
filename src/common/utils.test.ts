import { arrayMoveMutable, arrayMoveImmutable, getPercentage } from './utils'

describe('arrayMoveMutable', () => {
  it('should not mutate array if there are no elements', () => {
    const theArray: any[] = []
    arrayMoveMutable(theArray, 0, 1)

    expect(theArray).toHaveLength(0)
  })

  test('passing a negative number to fromIndex should use 0 instead', () => {
    const theArray = ['test', 'another test']
    arrayMoveMutable(theArray, -1, 1)

    expect(theArray).toHaveLength(2)
    expect(theArray[0]).toBe('test')
    expect(theArray[1]).toBe('another test')
  })

  test('passing a negative number to toIndex should use 0 instead', () => {
    const theArray = ['test', 'another test']
    arrayMoveMutable(theArray, 1, -1)

    expect(theArray).toHaveLength(2)
    expect(theArray[0]).toBe('test')
    expect(theArray[1]).toBe('another test')
  })
})

describe('arrayMoveImmutable', () => {
  it('should move the element to the desired position', () => {
    const theArray = ['test', 'testing']
    const newArray = arrayMoveImmutable(theArray, 0, 1)

    expect(theArray).toHaveLength(2)
    expect(theArray[0]).toBe('test')
    expect(theArray[1]).toBe('testing')

    expect(newArray).toHaveLength(2)
    expect(newArray[0]).toBe('testing')
    expect(newArray[1]).toBe('test')
  })
})

describe('getPercentage', () => {
  it('should return 0 if the first number is 0', () => {
    const percentage = getPercentage(0, 1)
    expect(percentage).toBe(0)
  })

  it('should return 0 if the second number is 0', () => {
    const percentage = getPercentage(1, 0)
    expect(percentage).toBe(0)
  })

  it('should swap first number with second number, if the later is greater', () => {
    const percentage = getPercentage(10, 1)
    expect(percentage).toBe(10)
  })

  it('should trucate numbers up to two places', () => {
    expect(getPercentage(38.2, 125)).toBe(30.56)
    expect(getPercentage(67.55, 125)).toBe(54.04)
    expect(getPercentage(86.65, 125)).toBe(69.32)
    expect(getPercentage(98.85, 125)).toBe(79.08)
  })

  it('should return the percentage of two numbers', () => {
    expect(getPercentage(4, 20)).toBe(20)
    expect(getPercentage(10, 10)).toBe(100)
    expect(getPercentage(10, 100)).toBe(10)
    expect(getPercentage(10, 40)).toBe(25)
    expect(getPercentage(15, 30)).toBe(50)
  })
})
