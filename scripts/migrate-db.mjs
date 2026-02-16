#!/usr/bin/env node
/**
 * Runs schema migrations on startup. Idempotent - safe to run multiple times.
 */
import Database from "better-sqlite3";
import { readFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

const dbDir = join(process.cwd(), "db");
const dbPath = join(dbDir, "learning-dashboard.db");
const drizzleDir = join(process.cwd(), "drizzle");

if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);

const migrationFiles = existsSync(drizzleDir)
  ? readdirSync(drizzleDir).filter((f) => f.endsWith(".sql")).sort()
  : [];
if (migrationFiles.length === 0) process.exit(0);

for (const file of migrationFiles) {
  const sql = readFileSync(join(drizzleDir, file), "utf-8");
  const statements = sql
    .split(/--> statement-breakpoint\n?/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    try {
      db.exec(stmt);
    } catch (err) {
      if (!err.message?.includes("already exists")) throw err;
    }
  }
}
db.close();
