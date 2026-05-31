import initSqlJs, { Database as SqlJsDatabase } from "sql.js";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "views.db");
const wasmPath = path.join(process.cwd(), "node_modules/sql.js/dist/sql-wasm.wasm");

let db: SqlJsDatabase | null = null;

async function getDb(): Promise<SqlJsDatabase> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: () => wasmPath,
  });

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE views (
        slug TEXT PRIMARY KEY,
        count INTEGER DEFAULT 0
      )
    `);
    saveDb();
  }

  return db;
}

function saveDb(): void {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

export async function getPostViews(slug: string): Promise<number> {
  const database = await getDb();
  const result = database.exec(`SELECT count FROM views WHERE slug = '${slug}'`);
  return result[0]?.values[0]?.[0] as number ?? 0;
}

export async function incrementPostViews(slug: string): Promise<void> {
  const database = await getDb();
  const result = database.exec(`SELECT count FROM views WHERE slug = '${slug}'`);

  if (result.length === 0 || result[0].values.length === 0) {
    database.run(`INSERT INTO views (slug, count) VALUES ('${slug}', 1)`);
  } else {
    database.run(`UPDATE views SET count = count + 1 WHERE slug = '${slug}'`);
  }
  saveDb();
}

export async function getAllPostViews(): Promise<Record<string, number>> {
  const database = await getDb();
  const result = database.exec("SELECT slug, count FROM views");
  if (!result[0]) return {};
  const rows = result[0].values as [string, number][];
  return Object.fromEntries(rows);
}