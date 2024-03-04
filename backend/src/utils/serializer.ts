import { Vector3 } from "../typings";

export type SerializedVector = `${string} ${number} ${number} ${number}`;
export type DeserializedVector = {
  label: string;
  vector: Vector3;
};

export function isSerializedVector(
  queryParam: string
): queryParam is SerializedVector {
  const split = queryParam.split("  ");

  if (split.length !== 4) return false;

  let hasValidCoordinates = true;
  // split[0] is a label string
  [split[1], split[2], split[3]].forEach((point) => {
    if (isNaN(parseInt(point)) || isNaN(parseFloat(point))) {
      hasValidCoordinates = false;
    }
  });

  return hasValidCoordinates;
}

const SPLITTER: string = "  " as const;

function serialize(data: DeserializedVector): string {
  const {
    label,
    vector: { x, y, z },
  } = data;

  return [label, x, y, z].join(SPLITTER);
}

function deserialize(data: string): DeserializedVector {
  if (!isSerializedVector(data)) throw new Error("Unexpected format");

  const [label, x, y, z] = data.split(SPLITTER);
  return {
    label,
    vector: {
      x: Number(x),
      y: Number(y),
      z: Number(z),
    },
  };
}

export const serializer = {
  serialize,
  deserialize,
};
