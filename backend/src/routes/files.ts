import express from "express";
import fileUpload from "express-fileupload";
import path from "node:path";

import { asyncHandler } from "../utils/asyncHandler";
import { fileService } from "../services/files";

const filesRouter = express.Router();

// middleware to handle multi-part form data
filesRouter.use(fileUpload());

filesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const file = await fileService.getFile(id);
    return res.json(file);
  })
);

filesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const files = await fileService.getAllFiles();
    return res.json(files);
  })
);

filesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const uploadedFile = req.files.file;

    if (Array.isArray(uploadedFile)) {
      return res.status(400).send("Was expecting a single file.");
    }

    const savePath = path.resolve(
      __dirname,
      "../../files/" + uploadedFile.name
    );

    uploadedFile.mv(savePath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });

    const createdFile = await fileService.createFile({
      name: uploadedFile.name,
      size: uploadedFile.size,
      file_path: savePath,
    });

    return res.json(createdFile);
  })
);

filesRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const updatedFile = await fileService.renameFile(id, name);

    return res.json(updatedFile);
  })
);

filesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    await fileService.deleteFile(id);

    return res.sendStatus(200);
  })
);

export { filesRouter };
