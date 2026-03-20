import client from "./index.ts";
import { prisma } from "../prisma/index.ts";

export const startTaskWorker = () => {
    setInterval(async () => {
        try {
            const batchSize = await client.lLen("task_operations_queue");
            if (batchSize === 0) return;

            const count = Math.min(batchSize, 50);
            const operationsList = [];
            for (let i = 0; i < count; i++) {
                const item = await client.lPop("task_operations_queue");
                if (item) operationsList.push(item);
            }

            if (operationsList.length === 0) return;
            const executePromises = [];

            for (const item of operationsList) {
                const { action, payload } = JSON.parse(item);

                if (action === "CREATE") {
                    executePromises.push(prisma.task.create({ 
                        data: {
                            id: payload.taskId,
                            userId: payload.userId,
                            title: payload.title,
                            description: payload.description
                        } 
                    }));
                } else if (action === "UPDATE") {
                    executePromises.push(prisma.task.updateMany({
                        where: { id: payload.taskId, userId: payload.userId },
                        data: { title: payload.title, description: payload.description }
                    }));
                } else if (action === "TOGGLE") {
                    const task = await prisma.task.findFirst({ where: { id: payload.taskId, userId: payload.userId } });
                    if (task) {
                        executePromises.push(prisma.task.updateMany({
                            where: { id: payload.taskId, userId: payload.userId },
                            data: { completed: !task.completed }
                        }));
                    }
                } else if (action === "DELETE") {
                    executePromises.push(prisma.task.deleteMany({
                        where: { id: payload.taskId, userId: payload.userId }
                    }));
                }
            }

            if (executePromises.length > 0) {
                await prisma.$transaction(executePromises);
                console.log(`[Worker] Processed ${executePromises.length} task operations.`);
            }

        } catch (err) {
            console.error("Task Queue Worker Error:", err);
        }
    }, 1000*60); 
};
