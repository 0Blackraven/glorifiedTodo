import type { Request, Response } from "express";
import {
    dbGetTasksByUser,
    dbCreateTask,
    dbGetTaskById,
    dbUpdateTask,
    dbToggleTaskStatus,
    dbDeleteTask,
} from "../prisma/services";

export const getTasks = async (req: Request, res: Response) => {
    if ((req.query.page !== undefined && isNaN(Number(req.query.page))) ||
        (req.query.limit !== undefined && isNaN(Number(req.query.limit)))) {
        return res.status(400).json("Invalid queris")
    }

    const page = req.query.page !== undefined ? Number(req.query.page) : undefined;
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : undefined;
    const status = req.query.status !== undefined ? req.query.status === "true" : undefined;
    const title = req.query.title?.toString() || undefined
    const userId = req.body.userId
    try {
        const tasks = await dbGetTasksByUser(userId, { page, limit, status, title });
        return res.status(200).json({ tasks });
    } catch (err) {
        return res.status(500).json({ error: `${err}` })
    }
}

export const createTask = async (req: Request, res: Response) => {
    const userId = req.body.userId
    const { title, description }: { title: string; description?: string } = req.body

    if (!title) return res.status(400).json({ error: "Title not provided" })

    try {
        const task = await dbCreateTask(userId, title, description)
        return res.status(201).json({ task })
    } catch (err) {
        return res.status(500).json({ error: `${err}` })
    }
}

export const getTaskById = async (req: Request, res: Response) => {
    const taskId = Number(req.params.id)
    const userId = req.body.userId

    if (isNaN(taskId)) return res.status(400).json({ error: "Invalid task id" })

    try {
        const task = await dbGetTaskById(taskId, userId)
        if (!task) return res.status(404).json({ error: "Task not found" })
        return res.status(200).json({ task })
    } catch (err) {
        return res.status(500).json({ error: `${err}` })
    }
}

export const updateTask = async (req: Request, res: Response) => {
    const taskId = Number(req.params.id)
    const userId = req.body.userId
    const { title, description }: { title?: string; description?: string } = req.body

    if (isNaN(taskId)) return res.status(400).json({ error: "Invalid task id" })
    if (description === undefined) return res.status(400).json({ error: "Nothing to update" })

    try {
        const result = await dbUpdateTask(taskId, userId, { title, description })
        if (result.count === 0) return res.status(404).json({ error: "Task not found" })
        return res.status(200).json({ result })
    } catch (err) {
        return res.status(500).json({ error: `${err}` })
    }
}

export const toggleStatus = async (req: Request, res: Response) => {
    const taskId = Number(req.params.id)
    const userId = req.body.userId

    if (isNaN(taskId)) return res.status(400).json({ error: "Invalid task id" })

    try {
        const result = await dbToggleTaskStatus(taskId, userId)
        if (!result) return res.status(404).json({ error: "Task not found" })
        return res.status(200).json({ result })
    } catch (err) {
        return res.status(500).json({ error: `${err}` })
    }
}

export const deleteTask = async (req: Request, res: Response) => {
    const taskId = Number(req.params.id)
    const userId = req.body.userId

    if (isNaN(taskId)) return res.status(400).json({ error: "Invalid task id" })

    try {
        const result = await dbDeleteTask(taskId, userId)
        if (result.count === 0) return res.status(404).json({ error: "Task not found" })
        return res.status(200).json({ message: "Task deleted" })
    } catch (err) {
        return res.status(500).json({ error: `${err}` })
    }
}