import { ObjFile, ObjFileMeta } from "../typings";

export function objFileFromMeta(meta: ObjFileMeta): ObjFile {
  const parsedDate = new Date(meta.creation_date);

  return {
    ...meta,
    creation_date: parsedDate,
  };
}
