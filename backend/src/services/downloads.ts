import fs from "node:fs/promises";

import {
  FileMetasRepository,
  fileMetasRepository,
} from "../repositories/fileMetas";

type DownloadInfo = {
  path: string;
  fileName: string;
};

export class DownloadsService {
  private repo: FileMetasRepository;

  constructor(repo: FileMetasRepository) {
    this.repo = repo;
  }

  async getDownloadInfo(fileId: string): Promise<DownloadInfo | undefined> {
    const fileMeta = await this.repo.read(fileId);

    if (!fileMeta) return;

    let fileExists = false;
    try {
      await fs.access(fileMeta.file_path);
      fileExists = true;
    } catch (error) {
      // intentionally suppressing the error here, it means we can't access the file
    }

    if (!fileExists) return;

    return { path: fileMeta.file_path, fileName: fileMeta.name };
  }
}
