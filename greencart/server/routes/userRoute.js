import express from "express";
import { isAuth, loginUser, logout, register } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", loginUser);
userRouter.post("/is-auth", authUser, isAuth);
userRouter.post("/logout", authUser, logout);

export default userRouter;
