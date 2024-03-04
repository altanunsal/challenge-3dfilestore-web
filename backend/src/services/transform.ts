import fs from "node:fs";
import readline from "node:readline/promises";

import { Vector3 } from "../typings";
import { isSerializedVector, serializer } from "../utils/serializer";

async function transform(
  filePath: string,
  scale: Vector3,
  offset: Vector3,
  callback: (transformedData: string) => void
): Promise<void> {
  const inputStream = fs.createReadStream(filePath);
  const reader = readline.createInterface({
    input: inputStream,
    crlfDelay: Infinity,
  });

  for await (const lineText of reader) {
    // update the values if it can be parsed, otherwise copy as is
    if (isSerializedVector(lineText)) {
      const line = serializer.deserialize(lineText);

      // apply transformations
      line.vector.x = line.vector.x * scale.x + offset.x;
      line.vector.y = line.vector.y * scale.y + offset.y;
      line.vector.z = line.vector.z * scale.z + offset.z;

      const newLine = serializer.serialize(line);
      callback(newLine);
    } else {
      callback(lineText);
    }

    callback("\n");
  }
}

export const transformService = {
  transform,
};
