import type { Response } from "express";
import type { AuthRequest } from "../middleware.ts";
import {dbGetTasksByUser, dbGetTaskById } from "../prisma/services.ts";
import { getCachedData, setCachedData, invalidateUserCache, pushToTaskQueue } from "../redis/services.ts";
import client from "../redis/index.ts";
import crypto from "crypto";

export const getTasks = async (req: AuthRequest, res: Response) => {
    if ((req.query.page !== undefined && isNaN(Number(req.query.page))) ||
        (req.query.limit !== undefined && isNaN(Number(req.query.limit)))) {
        return res.status(400).json("Invalid queris")
    }

    const page = req.query.page !== undefined ? Number(req.query.page) : undefined;
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : undefined;
    const status = req.query.status !== undefined ? req.query.status === "true" : undefined;
    const title = req.query.title?.toString() || undefined
    const userId = req.user
    
    const cacheKey = `tasks:user:${userId}:page:${page}:limit:${limit}:status:${status}:title:${title}`
    
    try {
        const cached = await getCachedData(cacheKey)
        if (cached) return res.status(200).json({ tasks: cached })

        let tasks = await dbGetTasksByUser(userId, { page, limit, status, title });
        
        // --- Merge Pending Queue Operations ---
        const pendingItems = await client.lRange("task_operations_queue", 0, -1);
        const userPendingOps = pendingItems.map(i => JSON.parse(i)).filter(op => op.payload.userId === userId);

        for (const op of userPendingOps) {
            if (op.action === "CREATE") {
                // Prepend dynamically created tasks to the list
                tasks.unshift({
                    id: op.payload.taskId,
                    title: op.payload.title,
                    description: op.payload.description || null,
                    completed: false,
                    userId: userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as any);
            } else if (op.action === "UPDATE") {
                const t = tasks.find(x => x.id === op.payload.taskId);
                if (t) { t.title = op.payload.title; t.description = op.payload.description; }
            } else if (op.action === "TOGGLE") {
                const t = tasks.find(x => x.id === op.payload.taskId);
                if (t) t.completed = !t.completed;
            } else if (op.action === "DELETE") {
                tasks = tasks.filter(x => x.id !== op.payload.taskId);
            }
        }
        // --------------------------------------

        await setCachedData(cacheKey, tasks, 60)
        return res.status(200).json({ tasks });
    } catch (err) {
        return res.status(500).json({ error: `${err}` })
    }
}

export const createTask = async (req: AuthRequest, res: Response) => {
    const userId = req.user
    const { title, description }: { title: string; description?: string } = req.body

    if (!title) return res.status(400).json({ error: "Title not provided" })

    const taskId = crypto.randomUUID()
    const task = { id: taskId, title, description: description || null, completed: false, userId, createdAt: new Date(), updatedAt: new Date() }

    try {
        await pushToTaskQueue("CREATE", { userId, taskId, title, description })
        await invalidateUserCache(userId)
        return res.status(201).json({ task })
    } catch (err) {
        return res.status(500).json({ error: `${err}` })
    }
}

export const getTaskById = async (req: AuthRequest, res: Response) => {
    const taskId = req.params.id as string
    const userId = req.user

    if (!taskId) return res.status(400).json({ error: "Invalid task id" })

    const cacheKey = `task:${taskId}:user:${userId}`

    try {
        const cached = await getCachedData(cacheKey)
        if (cached) return res.status(200).json({ task: cached })

        const task = await dbGetTaskById(taskId, userId)
        if (!task) return res.status(404).json({ error: "Task not found" })
        
        await setCachedData(cacheKey, task, 300)
        return res.status(200).json({ task })
    } catch (err) {
        return res.status(500).json({ error: `${err}` })
    }
}

export const updateTask = async (req: AuthRequest, res: Response) => {
    const taskId = req.params.id as string
    const userId = req.user
    const { title, description }: { title?: string; description?: string } = req.body

    if (!taskId) return res.status(400).json({ error: "Invalid task id" })
    if (description === undefined) return res.status(400).json({ error: "Nothing to update" })

    try {
        await pushToTaskQueue("UPDATE", { userId, taskId, title, description })
        await invalidateUserCache(userId)
        return res.status(200).json({ result: { count: 1 } })
    } catch (err) {
        return res.status(500).json({ error: `${err}` })
    }
}

export const toggleStatus = async (req: AuthRequest, res: Response) => {
    const taskId = req.params.id as string
    const userId = req.user

    if (!taskId) return res.status(400).json({ error: "Invalid task id" })

    try {
        await pushToTaskQueue("TOGGLE", { userId, taskId })
        await invalidateUserCache(userId)
        return res.status(200).json({ result: { count: 1 } })
    } catch (err) {
        return res.status(500).json({ error: `${err}` })
    }
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
    const taskId = req.params.id as string
    const userId = req.user

    if (!taskId) return res.status(400).json({ error: "Invalid task id" })

    try {
        await pushToTaskQueue("DELETE", { userId, taskId })
        await invalidateUserCache(userId)
        return res.status(200).json({ message: "Task deleted" })
    } catch (err) {
        return res.status(500).json({ error: `${err}` })
    }
}