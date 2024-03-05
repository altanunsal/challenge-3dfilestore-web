import { DeserializedVector, serializer } from '../../src/utils/serializer';

describe('vector serializer', () => {
  const deserialized: DeserializedVector = {
    label: 'v',
    vector: { x: 2, y: 3, z: 5 },
  };
  const serialized = 'v  2  3  5';

  it('serializes a valid vector correctly', () => {
    expect(serializer.serialize(deserialized)).toStrictEqual(serialized);
  });

  it('deserializes a valid vector correctly', () => {
    expect(serializer.deserialize(serialized)).toStrictEqual(deserialized);
  });

  it('throws when the provided serialized data is not a valid vector', () => {
    expect.assertions(1);

    try {
      serializer.deserialize('v  4  this-will-not  work  7  55');
    } catch (error: any) {
      expect(error.message).toBe('Unexpected format');
    }
  });

  it.each(['v,1,2,3', 'v 1 5 9'])(
    'throws when the provided serialized data is not using the correct delimiter/splitter',
    testString => {
      expect.assertions(1);

      try {
        serializer.deserialize(testString);
      } catch (error: any) {
        expect(error.message).toBe('Unexpected format');
      }
    },
  );

  it('throws when the provided serialized data does not contain parseable numbers', () => {
    expect.assertions(1);

    try {
      serializer.deserialize('v  t  b  c');
    } catch (error: any) {
      expect(error.message).toBe('Unexpected format');
    }
  });
});
