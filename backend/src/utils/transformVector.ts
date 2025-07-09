import { Vector3 } from '../typings';

export function transformVector(vector: Vector3, scale: Vector3, offset: Vector3): Vector3 {
  return {
    x: vector.x * scale.x + offset.x,
    y: vector.y * scale.y + offset.y,
    z: vector.z * scale.z + offset.z,
  };
}
