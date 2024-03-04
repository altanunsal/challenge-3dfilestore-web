import { open } from "sqlite";
import { Database } from "sqlite3";

const db = open({ filename: ":memory:", driver: Database });

export async function runSQL<TReturn = void>(
  ...args: Parameters<Database["all"]>
): Promise<TReturn extends void ? void : TReturn[]> {
  try {
    const dbInstance = await db;
    return await dbInstance.all<TReturn extends void ? void : TReturn[]>(
      ...args
    );
  } catch (e) {
    console.error("DB ERROR:", e);
    throw e;
  }
}

(async () => {
  // Files table
  await runSQL(`
CREATE TABLE files (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255),
  creation_date VARCHAR(255),
  size INTEGER,
  file_path VARCHAR(1023)
);
`);
})();
