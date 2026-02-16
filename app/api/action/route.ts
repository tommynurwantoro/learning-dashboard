import { NextResponse } from "next/server";
import { db } from "@/db";
import { learningAreas, learningTasks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case "add_area": {
        const { name, description, category, color, icon, targetDate } = data;
        const [area] = await db
          .insert(learningAreas)
          .values({
            name,
            description,
            category,
            color,
            icon,
            targetDate: targetDate ? new Date(targetDate) : null,
          })
          .returning();
        return NextResponse.json(area);
      }

      case "add_task": {
        const { areaId, title, description, status, priority, estimatedHours, dueDate } = data;
        const [task] = await db
          .insert(learningTasks)
          .values({
            areaId,
            title,
            description,
            status,
            priority,
            estimatedHours,
            dueDate: dueDate ? new Date(dueDate) : null,
          })
          .returning();
        return NextResponse.json(task);
      }

      case "update_task_status": {
        const { taskId, status, actualHours } = data;
        const updates: any = { status, updatedAt: new Date() };
        if (status === "completed") {
          updates.completedAt = new Date();
        }
        if (actualHours !== undefined) {
          updates.actualHours = actualHours;
        }
        
        const [task] = await db
          .update(learningTasks)
          .set(updates)
          .where(eq(learningTasks.id, taskId))
          .returning();
        return NextResponse.json(task);
      }

      case "delete_task": {
        const { taskId } = data;
        await db.delete(learningTasks).where(eq(learningTasks.id, taskId));
        return NextResponse.json({ success: true });
      }

      case "update_area": {
        const { areaId, ...updateData } = data;
        const [area] = await db
          .update(learningAreas)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(learningAreas.id, areaId))
          .returning();
        return NextResponse.json(area);
      }

      case "delete_area": {
        const { areaId } = data;
        await db.delete(learningAreas).where(eq(learningAreas.id, areaId));
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in API action:", error);
    return NextResponse.json({ error: "Failed to perform action" }, { status: 500 });
  }
}
