import { Vector3 } from '../typings';

export function transformVector(vector: Vector3, scale: Vector3, offset: Vector3): Vector3 {
  const transformedVector: Vector3 = vector;

  transformedVector.x = vector.x * scale.x + offset.x;
  transformedVector.y = vector.y * scale.y + offset.y;
  transformedVector.z = vector.z * scale.z + offset.z;

  return transformedVector;
}
