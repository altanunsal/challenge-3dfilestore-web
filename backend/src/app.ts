import express from "express";
import cors from "cors";

import { downloadsRouter } from "./routes/downloads";
import { filesRouter } from "./routes/files";
import { transformRouter } from "./routes/transform";
import { logger } from "./utils/logger";

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);

const apiRoutes = express.Router();
apiRoutes.use("/files", filesRouter);
apiRoutes.use("/transform", transformRouter);
app.use("/api", apiRoutes);

app.use("/downloads", downloadsRouter);

app.use(function serverErrorHandler(
  err: unknown,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.error(err);
  res.status(500).send({
    error: err instanceof Error ? err.message || "Unknown error" : err,
  });
});

app.listen(3333);
