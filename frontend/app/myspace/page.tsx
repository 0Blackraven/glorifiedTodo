"use client";
import { useState, useEffect } from "react";
import type { Task, FilterStatus } from "@/types";
import Navbar from "@/components/layout/Navbar";
import TaskToolbar from "@/components/tasks/TaskToolbar";
import TaskList from "@/components/tasks/TaskList";
import AddTaskForm from "@/components/tasks/AddTaskForm";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-background flex flex-row">
      <Navbar>
        <TaskToolbar
          filter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />

      </Navbar>

      <main className="flex-1 w-full mx-auto p-8 space-y-4 bg-amber-100">
        <div className="border-2 rounded-sm w-[60%]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder=  "Search tasks..."
          className="flex w-full h-8 text-black p-2"
        />
        </div>

        <Button onClick={() => setShowForm(true)}>Add Task</Button>
        <div className="mb-7">
          <p className="text-4xl font-bold m-0 text-black">
            Good {currentTime < 12 ? "Morning" : currentTime < 18 ? "Afternoon" : "Evening"}
          </p>
          <p className="text-m mt-1 mb-0 text-black ps-2">
            {counts.active} remaining · {counts.done} completed
          </p>
        </div>

        {showForm && (
          <AddTaskForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
        )}

        <TaskList tasks={filtered} onToggle={handleToggle} onDelete={handleDelete} />
      </main>
    </div>
  );
}
