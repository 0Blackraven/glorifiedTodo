/* routes to handle 
    /tasks/(GET/POST)
    /tasks/:id(GET/PATCH/DELETE)
    /tasks/:id/toggle
*/

import {Router} from "express"
import  {getTasks,createTask,getTaskById,updateTask,deleteTask,toggleStatus} from "./handler.ts"

import { authenticateToken } from "../middleware.ts"

const taskRouter = Router()
taskRouter.use(authenticateToken as any)
taskRouter.get("/", getTasks as any)
taskRouter.post("/", createTask as any)
taskRouter.get("/:id", getTaskById as any)
taskRouter.patch("/:id", updateTask as any)
taskRouter.delete("/:id", deleteTask as any)
taskRouter.patch("/:id/toggle", toggleStatus as any)

export default taskRouter;