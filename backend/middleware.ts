import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const access_secret = process.env.ACCESS_SECRET || "demo"

export interface AuthRequest extends Request {
    user: number
}

interface JwtPayload {
  userId: number;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (token === undefined) return res.status(401).json({ error: "Token absent" })
    const user = jwt.verify(token, access_secret)
    req.user = Number((user as JwtPayload).userId)
    next()
}
