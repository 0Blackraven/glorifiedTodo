import type { TaskWhereInput } from "../generated/prisma/models/Task.ts";
import { prisma } from "./index.ts";

export const dbCreateUser = (email: string, hashedPassword: string) => {
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
};

export const dbGetUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });
};


export const dbCreateRefreshToken = (
  userId: number,
  token: string,
  expiresAt: Date,
) => {
  return prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};

export const dbGetRefreshToken = (token: string) => {
  return prisma.refreshToken.findUnique({
    where: { token },
    select: {
      id: true,
      token: true,
      userId: true,
      expiresAt: true,
    },
  });
};

export const dbDeleteRefreshToken = (token: string) => {
  return prisma.refreshToken.delete({
    where: { token },
  });
};

export const dbDeleteAllRefreshTokensForUser = (userId: number) => {
  return prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

export const dbGetTasksByUser = (
  userId: number,
  options: {
    page?: number;
    limit?: number;
    status?: boolean;
    title?: string;
  } = {},
) => {
  const { page = 1, limit = 10, status, title } = options;
  const skip = (page - 1) * limit;

  const where:TaskWhereInput = { userId };

  if (status !== undefined) {
    where.completed = status;
  }

  if (title) {
    where.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  return prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
};


export const dbGetTasksCount = (
  userId: number,
  options: {
    status?: boolean;
    title?: string;
  } = {},
) => {
  const { status, title } = options;

  const where: TaskWhereInput = { userId };

  if (status !== undefined) {
    where.completed = status;
  }

  if (title) {
    where.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  return prisma.task.count({ where });
};

export const dbCreateTask = (
  userId: number,
  title: string,
  description?: string,
) => {
  return prisma.task.create({
    data: {
      title,
      description,
      userId,
    },
  });
};


export const dbGetTaskById = (taskId: string, userId: number) => {
  return prisma.task.findFirst({
    where: { id: taskId, userId },
  });
};

export const dbUpdateTask = (
  taskId: string,
  userId: number,
  data: { title?: string; description?: string },
) => {
  return prisma.task.updateMany({
    where: { id: taskId, userId },
    data,
  });
};

export const dbToggleTaskStatus = async (taskId: string, userId: number) => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
    select: { completed: true },
  });

  if (!task) return null;

  return prisma.task.updateMany({
    where: { id: taskId, userId },
    data: { completed: !task.completed },
  });
};

export const dbDeleteTask = (taskId: string, userId: number) => {
  return prisma.task.deleteMany({
    where: { id: taskId, userId },
  });
};
