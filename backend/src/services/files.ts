import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";

import { fileMetasRepository } from "../repositories/fileMetas";
import { ObjFile, ObjFileMeta } from "../typings";
import { objFileFromMeta } from "../utils/objFileFromMeta";

async function getAllFiles(): Promise<ObjFile[]> {
  const metaDatas = await fileMetasRepository.read();

  if (!metaDatas) return [];

  return metaDatas.map(objFileFromMeta);
}

async function getFile(id: string): Promise<ObjFile | undefined> {
  const metadata = await fileMetasRepository.read(id);

  if (!metadata) return undefined;

  return objFileFromMeta(metadata);
}

async function createFile(
  data: Omit<ObjFileMeta, "id" | "creation_date">
): Promise<ObjFile> {
  const id = randomUUID();
  const creation_date = new Date().toISOString();

  const file = { ...data, id, creation_date };

  await fileMetasRepository.create(file);

  return objFileFromMeta(file);
}

async function renameFile(
  id: string,
  newName: string
): Promise<ObjFile | undefined> {
  const updatedMeta = await fileMetasRepository.update(id, { name: newName });

  if (!updatedMeta) return undefined;

  return objFileFromMeta(updatedMeta);
}

async function deleteFile(id: string): Promise<{ success: boolean }> {
  const existingFile = await fileMetasRepository.read(id);

  if (!existingFile) return { success: false };

  await unlink(existingFile.file_path);
  await fileMetasRepository.delete(id);

  return { success: true };
}

export const fileService = {
  getAllFiles,
  getFile,
  createFile,
  renameFile,
  deleteFile,
};
