import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const learningAreas = sqliteTable("learning_areas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "tech", "language", "soft_skill", etc.
  color: text("color").default("#3b82f6"), // hex color for UI
  icon: text("icon").default("BookOpen"), // lucide-react icon name
  targetDate: integer("target_date", { mode: "timestamp" }), // when to complete by
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const learningTasks = sqliteTable("learning_tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  areaId: integer("area_id")
    .notNull()
    .references(() => learningAreas.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", {
    enum: ["not_started", "in_progress", "completed", "on_hold"],
  })
    .default("not_started")
    .notNull(),
  priority: text("priority", {
    enum: ["low", "medium", "high", "urgent"],
  })
    .default("medium")
    .notNull(),
  estimatedHours: real("estimated_hours"),
  actualHours: real("actual_hours").default(0),
  dueDate: integer("due_date", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const studySessions = sqliteTable("study_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id").references(() => learningTasks.id, {
    onDelete: "set null",
  }),
  areaId: integer("area_id").references(() => learningAreas.id),
  duration: integer("duration").notNull(), // minutes
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const resources = sqliteTable("resources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id").references(() => learningTasks.id, {
    onDelete: "cascade",
  }),
  areaId: integer("area_id").references(() => learningAreas.id),
  title: text("title").notNull(),
  url: text("url"),
  type: text("type", {
    enum: ["article", "video", "book", "course", "documentation", "other"],
  })
    .default("article")
    .notNull(),
  status: text("status", {
    enum: ["to_read", "reading", "completed"],
  })
    .default("to_read")
    .notNull(),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Types
export type LearningArea = typeof learningAreas.$inferSelect;
export type NewLearningArea = typeof learningAreas.$inferInsert;
export type LearningTask = typeof learningTasks.$inferSelect;
export type NewLearningTask = typeof learningTasks.$inferInsert;
export type StudySession = typeof studySessions.$inferSelect;
export type NewStudySession = typeof studySessions.$inferInsert;
export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
