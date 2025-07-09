import express from "express";

export const logger: express.RequestHandler = (req, res, next) => {
  res.on("finish", () => {
    console.info(
      `[${req.method.padStart(7, " ")}] ${req.path} - ${res.statusCode}`
    );
  });
  next();
};
