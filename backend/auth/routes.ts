/* routes to handle 
    auth/register
    auth/login
    auth/refresh
    auth/logout
*/
import {Router} from "express"
import { registerUser,loginUser,refreshTokenChange,userLogout } from "./handler.ts"

export const userRouter = Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/refresh", refreshTokenChange)
userRouter.post("/logout", userLogout)