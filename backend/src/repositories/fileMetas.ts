import { runSQL } from "../db";
import { ObjFileMeta } from "../typings";
import { Repository } from "./repository";

export type FileMetasRepository = Repository<ObjFileMeta>;

async function read(id: string): Promise<ObjFileMeta>;
async function read(): Promise<ObjFileMeta[]>;
async function read(
  id?: string
): Promise<ObjFileMeta | ObjFileMeta[] | undefined> {
  if (id) {
    const rows = await runSQL<ObjFileMeta>(
      `SELECT files.* FROM files WHERE id = ?;`,
      [id]
    );

    if (!rows.length) return undefined;

    return rows[0];
  } else {
    return await runSQL<ObjFileMeta>(`SELECT * FROM files;`);
  }
}

export const fileMetasRepository: FileMetasRepository = {
  async create(data) {
    const { id, name, size, file_path, creation_date } = data;

    const createdRows = await runSQL<ObjFileMeta>(
      `INSERT INTO files (id, name, size, creation_date, file_path) VALUES (?, ?, ?, ?, ?) RETURNING *;`,
      [id, name, size, creation_date, file_path]
    );

    return createdRows[0];
  },

  read,

  async update(id, data) {
    const { name } = data;

    const rows = await runSQL<ObjFileMeta>(
      `UPDATE files SET name = ? WHERE id = ? RETURNING *;`,
      [name, id]
    );

    if (!rows) return undefined;

    return rows[0];
  },

  async delete(id) {
    return await runSQL(`DELETE FROM files WHERE id = ?;`, [id]);
  },
};
