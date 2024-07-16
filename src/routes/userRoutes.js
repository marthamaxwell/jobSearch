import express from "express";
import getAllUsers from "../controllers/userController.js";
import { loginUser, regUSer } from "../controllers/authController.js";

const userRouter = express.Router();

userRouter.post("/signup", regUSer);
userRouter.post("/login", loginUser);
userRouter.get("/allUsers", getAllUsers);

export default userRouter;
