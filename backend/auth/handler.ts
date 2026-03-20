import type { Request, Response } from "express"
import crypto from "crypto"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import {
  dbCreateUser,
  dbGetUserByEmail,
  dbCreateRefreshToken,
  dbGetRefreshToken,
  dbDeleteRefreshToken,
  dbDeleteAllRefreshTokensForUser,
} from "../prisma/services.ts"

dotenv.config();
const SALT_ROUNDS = 10
const TOKEN_TTL_DAYS = 3
const access_secret = process.env.ACCESS_SECRET || "demo"


const generateToken = (): string => {
  return crypto.randomBytes(64).toString("hex")
}

const expiresInDays = (days: number): Date => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

function generateAccessToken(userId: number) {
  return jwt.sign({ userId }, access_secret, { expiresIn: "15m" });
}


export const registerUser = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body

  if (!email) return res.status(400).json({ error: "Email not provided" })
  if (!password) return res.status(400).json({ error: "Password not provided" })

  try {
    const existing = await dbGetUserByEmail(email)
    if (existing) return res.status(409).json({ error: "Email already in use" })

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await dbCreateUser(email, hashedPassword)

    const token = generateToken()
    await dbCreateRefreshToken(user.id, token, expiresInDays(TOKEN_TTL_DAYS))
    const accessToken = generateAccessToken(user.id);

    res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000 //3 days
    });

    return res.status(201).json({
      message: "User registered successfully",
      accessToken: accessToken,
    })
  } catch (err) {
    return res.status(500).json({ error: `${err}` })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body

  if (!email) return res.status(400).json({ error: "Email not provided" })
  if (!password) return res.status(400).json({ error: "Password not provided" })

  try {
    const user = await dbGetUserByEmail(email)
    if (!user) return res.status(401).json({ error: "Invalid credentials" })

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials" })

    const token = generateToken()
    await dbCreateRefreshToken(user.id, token, expiresInDays(TOKEN_TTL_DAYS))
    const accessToken = generateAccessToken(user.id);

    res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000 //3 days
    });
    return res.status(200).json({
      message: "Login successful",
        accessToken: accessToken,
    })
  } catch (err) {
    return res.status(500).json({ error: `${err}` })
  }
}

export const userLogout = async (req: Request, res: Response) => {
  const logoutAll: boolean | undefined  = req.body
  const refreshToken: string = req.cookies.refreshToken

  if (!refreshToken) return res.status(400).json({ error: "Token absent" })

  try {
    const record = await dbGetRefreshToken(refreshToken)
    if (!record) return res.status(401).json({ error: "Not authenticated" })

    if (logoutAll) {
      await dbDeleteAllRefreshTokensForUser(record.userId)
    } else {
      await dbDeleteRefreshToken(refreshToken)
    }
    res.clearCookie("refreshToken")
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (err) {
    return res.status(500).json({ error: `${err}` })
  }
}

export const refreshTokenChange = async (req: Request, res: Response) => {
  const { refreshToken }: { refreshToken: string } = req.cookies.refreshToken
  if (!refreshToken) return res.status(400).json({ error: "Please login again" })

  try {
    const record = await dbGetRefreshToken(refreshToken)
    if (!record) return res.status(401).json({ error: "Please login again" })

    if (record.expiresAt < new Date()) {
      await dbDeleteRefreshToken(refreshToken)
      return res.status(401).json({ error: "Please login again" })
    }

    
    await dbDeleteRefreshToken(refreshToken)
    const newToken = generateToken()
    await dbCreateRefreshToken(record.userId, newToken, expiresInDays(TOKEN_TTL_DAYS))
    const accessToken = generateAccessToken(record.userId);

    res.cookie("refreshToken", newToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000 //3 days
    });
    return res.status(200).json({
      message: "Token refreshed",
      accessToken: accessToken,
    })

  } catch (err) {
    return res.status(500).json({ error: `${err}` })
  }
}
