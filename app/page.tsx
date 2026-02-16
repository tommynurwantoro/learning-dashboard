"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Target, TrendingUp } from "lucide-react";

type LearningArea = {
  id: number;
  name: string;
  description: string;
  category: string;
  color: string;
  icon: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  spentHours: number;
  targetDate?: string;
};

type Stats = {
  totalAreas: number;
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  spentHours: number;
};

export default function DashboardPage() {
  const [areas, setAreas] = useState<LearningArea[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAreas: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalHours: 0,
    spentHours: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/areas");
      const data = await response.json();
      setAreas(data);

      const newStats: Stats = data.reduce(
        (acc: Stats, area: LearningArea) => ({
          totalAreas: acc.totalAreas + 1,
          totalTasks: acc.totalTasks + area.totalTasks,
          completedTasks: acc.completedTasks + area.completedTasks,
          totalHours: acc.totalHours + area.totalHours,
          spentHours: acc.spentHours + area.spentHours,
        }),
        { totalAreas: 0, totalTasks: 0, completedTasks: 0, totalHours: 0, spentHours: 0 }
      );
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const overallProgress =
    stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Learning Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your progress across multiple learning areas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Areas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAreas}</div>
              <p className="text-xs text-muted-foreground">Active areas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedTasks} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.spentHours.toFixed(1)}h
              </div>
              <p className="text-xs text-muted-foreground">
                of {stats.totalHours.toFixed(1)}h estimated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallProgress.toFixed(0)}%</div>
              <Progress value={overallProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Learning Areas */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Learning Areas
          </h2>
          {loading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : areas.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No learning areas yet. Add some via chat commands!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map((area) => (
                <Card
                  key={area.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-l-4"
                  style={{ borderLeftColor: area.color }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{area.name}</span>
                      <Badge variant="outline">{area.category}</Badge>
                    </CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Progress</span>
                          <span className="font-medium">{area.progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={area.progress} style={{ backgroundColor: `${area.color}20` }} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-600 dark:text-slate-400">Tasks:</span>{" "}
                          <span className="font-medium">
                            {area.completedTasks}/{area.totalTasks}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600 dark:text-slate-400">Time:</span>{" "}
                          <span className="font-medium">
                            {area.spentHours.toFixed(1)}h
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Chat Integration Info */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Chat Integration
            </CardTitle>
            <CardDescription>
              Use Thomas chat to manage your learning progress with natural language commands
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Add a learning area:</strong> "Add learning area for Rust programming"</p>
              <p><strong>Add a task:</strong> "Add task 'Learn ownership' to Rust area"</p>
              <p><strong>Update progress:</strong> "Mark 'Learn ownership' as completed"</p>
              <p><strong>Check status:</strong> "Show my learning progress"</p>
              <p><strong>Add time spent:</strong> "Log 2 hours for 'Learn ownership' task"</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
