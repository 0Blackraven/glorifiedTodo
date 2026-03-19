/* routes to handle 
    /tasks/(GET/POST)
    /tasks/:id(GET/PATCH/DELETE)
    /tasks/:id/toggle
*/

import {Router} from "express"
import  {getTasks,createTask,getTaskById,updateTask,deleteTask,toggleStatus} from "./handler.ts"

const taskRouter = Router()
// taskRouter.use(middleware)
taskRouter.get("/", getTasks)
taskRouter.post("/", createTask)
taskRouter.get("/:id", getTaskById)
taskRouter.patch("/:id", updateTask)
taskRouter.delete("/:id", deleteTask)
taskRouter.patch("/:id/toggle", toggleStatus)

export default taskRouter;