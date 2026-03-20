"use client";
import { useState, useEffect } from "react";
import type { Task, FilterStatus } from "@/types";
import Navbar from "@/components/layout/Navbar";
import TaskToolbar from "@/components/tasks/TaskToolbar";
import TaskList from "@/components/tasks/TaskList";
import AddTaskForm from "@/components/tasks/AddTaskForm";

const STALE_TASKS: Task[] = [
  { id: 1, title: "Design the database schema", description: "Plan User, Task, and RefreshToken models in Prisma", completed: true, createdAt: "2026-03-18" },
  { id: 2, title: "Build auth handlers", description: "Register, login, logout, and token refresh endpoints", completed: true, createdAt: "2026-03-19" },
  { id: 3, title: "Build task handlers", description: "CRUD + toggle status for tasks", completed: true, createdAt: "2026-03-19" },
  { id: 4, title: "Add auth middleware", description: "Verify refresh token and attach userId to req", completed: false, createdAt: "2026-03-20" },
  { id: 5, title: "Wire up frontend to backend API", description: "Replace stale data with real fetch calls", completed: false, createdAt: "2026-03-20" },
  { id: 6, title: "Add pagination to task list", description: "Use page and limit query params", completed: false, createdAt: "2026-03-20" },
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(STALE_TASKS);
  const [currentTime, setTime] = useState<number>(new Date().getHours());
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = tasks.filter((t) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "done" && t.completed) ||
      (filter === "active" && !t.completed);
    const matchesSearch = search === "" || t.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() =>{
    setTime(new Date().getHours());
  },[])

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    done: tasks.filter((t) => t.completed).length,
  };

  const handleToggle = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAdd = (title: string, description?: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[720px] w-full mx-auto p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold m-0 text-foreground">
            Good {currentTime < 12 ? "Morning" : currentTime < 18 ? "Afternoon" : "Evening"}
          </h1>
          <p className="text-muted-foreground mt-1 mb-0 text-sm">
            {counts.active} remaining · {counts.done} completed
          </p>
        </div>

        <TaskToolbar
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          onAddClick={() => setShowForm((v) => !v)}
          counts={counts}
        />

        {showForm && (
          <AddTaskForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
        )}

        <TaskList tasks={filtered} onToggle={handleToggle} onDelete={handleDelete} />
      </main>
    </div>
  );
}
