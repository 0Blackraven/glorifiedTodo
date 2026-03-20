"use client";
import { useState, useEffect } from "react";
import type { Task, FilterStatus } from "@/types";
import Navbar from "@/components/layout/Navbar";
import TaskToolbar from "@/components/tasks/TaskToolbar";
import TaskList from "@/components/tasks/TaskList";
import AddTaskForm from "@/components/tasks/AddTaskForm";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTime, setTime] = useState<number>(() => new Date().getHours());
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
    const token = localStorage.getItem("accessToken");
    fetch("http://localhost:8080/tasks", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.tasks) {
          setTasks(data.tasks);
        }
      })
      .catch(console.error);
  },[])

  useEffect(() => {
  const interval = setInterval(() => {
    setTime(new Date().getHours());
  }, 60000*60); // every minute

  return () => clearInterval(interval);
  }, []);

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    done: tasks.filter((t) => t.completed).length,
  };

  const handleToggle = async (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://localhost:8080/tasks/${id}/toggle`, { 
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}` } 
      });
    } catch (err) {
      console.error(err);
      // Revert optimism if failed
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    }
  };

  const handleDelete = async (id: number) => {
    const backup = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://localhost:8080/tasks/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` } 
      });
    } catch (err) {
      console.error(err);
      setTasks(backup);
    }
  };

  const handleAdd = async (title: string, description?: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (data.task) setTasks((prev) => [data.task, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-180 w-full mx-auto p-8">
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
