import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { serializer } from "../utils/serializer";
import { transformService } from "../services/transform";
import { fileMetasRepository } from "../repositories/fileMetas";

const transformRouter = express.Router();

transformRouter.use(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { scale, offset } = req.query;

    if (
      !scale ||
      !offset ||
      typeof scale !== "string" ||
      typeof offset !== "string"
    ) {
      res.sendStatus(400);
      return;
    }

    const scaleVector = serializer.deserialize(scale).vector;
    const offsetVector = serializer.deserialize(offset).vector;

    const fileMeta = await fileMetasRepository.read(id);
    if (!fileMeta) {
      res.sendStatus(404);
      return;
    }

    res.set("Content-Type", "text/plain");
    res.set(
      "Content-Disposition",
      `attachment; filename= ${id}_transformed.obj`
    );

    const transformedStream = transformService.transform(
      fileMeta.file_path,
      scaleVector,
      offsetVector
    );

    for await (const chunk of transformedStream) {
      res.write(chunk, "utf-8");
    }

    res.end();
  })
);

export { transformRouter };
