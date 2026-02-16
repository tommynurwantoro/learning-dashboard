import { NextResponse } from "next/server";
import { db } from "@/db";
import { learningAreas } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const areas = await db
      .select()
      .from(learningAreas)
      .orderBy(desc(learningAreas.updatedAt))
      .all();

    // Calculate progress for each area
    const areasWithProgress = await Promise.all(
      areas.map(async (area) => {
        const tasks = await db.query.learningTasks.findMany({
          where: (tasks, { eq }) => eq(tasks.areaId, area.id),
        });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((t) => t.status === "completed").length;
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const totalHours = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
        const spentHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

        return {
          ...area,
          progress,
          totalTasks,
          completedTasks,
          totalHours,
          spentHours,
        };
      })
    );

    return NextResponse.json(areasWithProgress);
  } catch (error) {
    console.error("Error fetching learning areas:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning areas" },
      { status: 500 }
    );
  }
}
