import express from "express";
import { regUSer } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signUp", regUSer);

export default userRouter;
