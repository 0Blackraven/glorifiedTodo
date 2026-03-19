import express from "express";
import {createServer} from "http";
import dotenv from "dotenv";
import taskRouter from "./tasks/routes.ts";
import { userRouter } from "./auth/routes.ts";


dotenv.config()
const app = express()
app.use(express.json())

app.use("/tasks", taskRouter)
app.use("/auth", userRouter)
const server = createServer(app)

const port = process.env.PORT || "8080"

server.listen(8080, ()=> {
    console.log(`listening to ${port}`)
})

