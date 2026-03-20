import express from "express";
import {createServer} from "http";
import dotenv from "dotenv";
import taskRouter from "./tasks/routes.ts";
import { userRouter } from "./auth/routes.ts";
import cors from "cors"
import cookieParser from "cookie-parser"
import { startTaskWorker } from "./redis/worker.ts"


dotenv.config()

const corsOption = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

const app = express()
app.use(express.json())
app.use(cors(corsOption))
app.use(cookieParser())

app.use("/tasks", taskRouter)
app.use("/auth", userRouter)
const server = createServer(app)

const port = process.env.PORT || "8080"

startTaskWorker()

server.listen(8080, ()=> {
    console.log(`listening to ${port}`)
})

