import { arrayMoveMutable, arrayMoveImmutable } from './utils';

describe('arrayMoveMutable', () => {
  it('should not mutate array if there are no elements', () => {
    const theArray: any[] = [];
    arrayMoveMutable(theArray, 0, 1);

    expect(theArray).toHaveLength(0);
  });

  test('passing a negative number to fromIndex should use 0 instead', () => {
    const theArray = ['test', 'another test'];
    arrayMoveMutable(theArray, -1, 1);

    expect(theArray).toHaveLength(2);
    expect(theArray[0]).toBe('test');
    expect(theArray[1]).toBe('another test');
  });

  test('passing a negative number to toIndex should use 0 instead', () => {
    const theArray = ['test', 'another test'];
    arrayMoveMutable(theArray, 1, -1);

    expect(theArray).toHaveLength(2);
    expect(theArray[0]).toBe('test');
    expect(theArray[1]).toBe('another test');
  });
});

describe('arrayMoveImmutable', () => {
  it('should move the element to the desired position', () => {
    const theArray = ['test', 'testing'];
    const newArray = arrayMoveImmutable(theArray, 0, 1);

    expect(theArray).toHaveLength(2);
    expect(theArray[0]).toBe('test');
    expect(theArray[1]).toBe('testing');

    expect(newArray).toHaveLength(2);
    expect(newArray[0]).toBe('testing');
    expect(newArray[1]).toBe('test');
  });
});
