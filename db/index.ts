import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { existsSync, mkdirSync } from "path";
import { join } from "path";

const dbDir = join(process.cwd(), "db");
const dbPath = join(dbDir, "learning-dashboard.db");

// Ensure db directory exists
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Initialize with default data if empty
export async function initDb() {
  const areas = await db.select().from(schema.learningAreas).all();
  
  if (areas.length === 0) {
    console.log("Initializing database with default data...");
    await db
      .insert(schema.learningAreas)
      .values([
        {
          name: "Next.js",
          description: "React framework for building web applications",
          category: "tech",
          color: "#000000",
          icon: "Layout",
        },
        {
          name: "Solidity",
          description: "Smart contract development for Ethereum",
          category: "tech",
          color: "#627eea",
          icon: "Code2",
        },
        {
          name: "AI Vibe Coding",
          description: "Using AI for programming and code generation",
          category: "tech",
          color: "#8b5cf6",
          icon: "Brain",
        },
      ])
      .run();

    const insertedAreas = await db.select().from(schema.learningAreas).all();

    await db
      .insert(schema.learningTasks)
      .values([
        {
          areaId: insertedAreas[0].id,
          title: "Learn App Router",
          description: "Understand the new App Router architecture",
          status: "in_progress",
          priority: "high",
          estimatedHours: 8,
        },
        {
          areaId: insertedAreas[0].id,
          title: "Master Server Components",
          description: "Learn to use React Server Components effectively",
          status: "not_started",
          priority: "medium",
          estimatedHours: 6,
        },
        {
          areaId: insertedAreas[1].id,
          title: "Write first smart contract",
          description: "Create a simple token contract",
          status: "not_started",
          priority: "high",
          estimatedHours: 4,
        },
        {
          areaId: insertedAreas[2].id,
          title: "Explore Cursor IDE",
          description: "Learn AI-powered coding with Cursor",
          status: "completed",
          priority: "medium",
          estimatedHours: 2,
          actualHours: 1.5,
          completedAt: new Date(),
        },
      ])
      .run();
  }
}
