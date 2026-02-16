import { NextResponse } from "next/server";
import { db } from "@/db";
import { learningAreas } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const tasks = await db.query.learningTasks.findMany({
      orderBy: (tasks, { desc }) => [desc(tasks.priority), desc(tasks.createdAt)],
      with: {
        area: true,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}
