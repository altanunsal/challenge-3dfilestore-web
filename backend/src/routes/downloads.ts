import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { DownloadsService } from "../services/downloads";
import { fileMetasRepository } from "../repositories/fileMetas";

const downloadsRouter = express.Router();

downloadsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const downloadService = new DownloadsService(fileMetasRepository);
    const downloadInfo = await downloadService.getDownloadInfo(id);

    if (!downloadInfo) {
      res.sendStatus(404);
      return;
    }

    res.set("Content-Type", "text/plain");
    res.set(
      "Content-Disposition",
      `attachment; filename= ${downloadInfo.fileName}.obj`
    );
    res.sendFile(downloadInfo.path);
  })
);

export { downloadsRouter };
