import fs from "node:fs/promises";

import { ObjFileMeta } from "../../src/typings";
import { DownloadsService } from "../../src/services/downloads";

describe("Downloads Service", () => {
  let fsAccessSpy: jest.SpyInstance;

  beforeEach(() => {
    fsAccessSpy = jest.spyOn(fs, "access").mockResolvedValue();
  });

  afterEach(() => {
    fsAccessSpy.mockRestore();
    jest.restoreAllMocks();
  });

  const baseFileMeta: ObjFileMeta = {
    id: "some-id",
    name: "some-name",
    size: 123123,
    creation_date: new Date().toISOString(),
    file_path: "some-path",
  };

  it("provides the correct file path and file name for an existing file", async () => {
    const filesMetaRepository = {
      read: jest.fn().mockResolvedValue(baseFileMeta),
    };
    // @ts-expect-error incomplete mock
    const downloadService = new DownloadsService(filesMetaRepository);
    const result = await downloadService.getDownloadInfo(baseFileMeta.id);

    expect(result).toStrictEqual({
      path: baseFileMeta.file_path,
      fileName: baseFileMeta.name,
    });
  });

  it("returns undefined if the expected file does not exist in the DB", async () => {
    const filesMetaRepository = {
      read: jest.fn().mockResolvedValue(undefined),
    };

    // @ts-expect-error incomplete mock
    const downloadService = new DownloadsService(filesMetaRepository);
    const result = await downloadService.getDownloadInfo(baseFileMeta.id);

    expect(result).toBeUndefined();
  });

  it.skip("returns undefined if the expected file does not exist in the filesystem", async () => {
    const filesMetaRepository = {
      read: jest.fn().mockResolvedValue(baseFileMeta),
    };

    fsAccessSpy.mockRejectedValueOnce(new Error());

    // @ts-expect-error incomplete mock
    const downloadService = new DownloadsService(filesMetaRepository);
    const result = await downloadService.getDownloadInfo(baseFileMeta.id);

    expect(result).toBeUndefined();
  });
});
