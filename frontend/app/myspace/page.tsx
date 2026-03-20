"use client";
import { useState, useEffect } from "react";
import type { Task, FilterStatus } from "@/types";
import Navbar from "@/components/layout/Navbar";
import TaskList from "@/components/tasks/TaskList";
import AddTaskForm from "@/components/tasks/AddTaskForm";
import { Search } from "lucide-react";

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

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().getHours());
    }, 60000 * 60);
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

  const greeting =
    currentTime < 12 ? "Good Morning" : currentTime < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="min-h-screen bg-[#FFF8F3] flex flex-row">
      {/* Sidebar */}
      <Navbar
        activeFilter={filter}
        onFilterChange={(f) => setFilter(f as FilterStatus)}
        counts={counts}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8 pt-[72px] md:pt-8 max-w-5xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight">
              {greeting} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#A8A29E] mt-1">
              {counts.active} active · {counts.done} completed
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5 md:mb-6">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D6D3D1]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-11 pr-4 py-2.5 md:py-3 bg-white rounded-2xl border border-[#E7E5E4] text-sm text-[#1C1917] placeholder:text-[#D6D3D1] outline-none focus:border-[#E8864A] focus:shadow-sm transition-all"
          />
        </div>

        {/* Add Task Form */}
        {showForm && (
          <div className="mb-5 md:mb-6">
            <AddTaskForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* Task List */}
        <TaskList
          tasks={filtered}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onAddClick={() => setShowForm(true)}
          showingForm={showForm}
        />
      </main>
    </div>
  );
}
