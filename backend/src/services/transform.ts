import fs from 'node:fs';
import readline from 'node:readline/promises';

import { Vector3 } from '../typings';
import { isSerializedVector, serializer } from '../utils/serializer';
import { transformVector } from '../utils/transformVector';

async function* transform(
  filePath: string,
  scale: Vector3,
  offset: Vector3,
): AsyncGenerator<string> {
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
      const tranformationResult = transformVector(line.vector, scale, offset);

      const newLine = serializer.serialize({ label: line.label, vector: tranformationResult });
      yield newLine;
    } else {
      yield lineText;
    }

    yield '\n';
  }
}

export const transformService = {
  transform,
};
