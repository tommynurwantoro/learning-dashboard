import { NextResponse } from "next/server";
import { db } from "@/db";
import { learningAreas, learningTasks } from "@/db/schema";
import { eq, desc, and, or, like } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid area ID" }, { status: 400 });
    }

    const area = await db
      .select()
      .from(learningAreas)
      .where(eq(learningAreas.id, id))
      .get();

    if (!area) {
      return NextResponse.json({ error: "Area not found" }, { status: 404 });
    }

    const tasks = await db
      .select()
      .from(learningTasks)
      .where(eq(learningTasks.areaId, id))
      .orderBy(desc(learningTasks.priority), desc(learningTasks.createdAt))
      .all();

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const totalHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const spentHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

    return NextResponse.json({
      ...area,
      progress,
      totalTasks,
      completedTasks,
      totalHours,
      spentHours,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching area details:", error);
    return NextResponse.json(
      { error: "Failed to fetch area details" },
      { status: 500 }
    );
  }
}
