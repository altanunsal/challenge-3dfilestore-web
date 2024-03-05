import { Vector3 } from '../../src/typings';
import { transformVector } from '../../src/utils/transformVector';

describe('transformVector', () => {
  it('transforms a vector according to the provided scale and offset', () => {
    const vector: Vector3 = {
      x: 2,
      y: 10,
      z: 6,
    };

    const scale: Vector3 = {
      x: 2,
      y: 10,
      z: 6,
    };

    const offset: Vector3 = {
      x: 1,
      y: 7,
      z: 8.4,
    };

    const result = transformVector(vector, scale, offset);

    expect(result).toMatchSnapshot();
  });
});
