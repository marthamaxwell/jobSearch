import express from "express";
import { getAllUsers, regUSer } from "../controllers/authController.js";

const userRouter = express.Router();

userRouter.post("/signup", regUSer);
userRouter.get("/allUsers", getAllUsers);
export default userRouter;
