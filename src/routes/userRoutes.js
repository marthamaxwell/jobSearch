import express from "express";
import { getAllUsers, regUSer } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signUp", regUSer);
userRouter.get("/allUsers", getAllUsers);
export default userRouter;
