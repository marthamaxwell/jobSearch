import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import expressSanitizer from "express-sanitizer";
import morgan from "morgan";

import userRouter from "./src/routes/userRoutes.js";
import jobsRouter from "./src/routes/jobsRoutes.js";

dotenv.config();
const app = express();

const myPort = process.env.PORT;
const dataBase = process.env.DATABASE;

//middleware
app.use(express.json());
app.use(expressSanitizer());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use("/jobs", jobsRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("hey puting more effort here");
});

mongoose
  .connect(dataBase)
  .then(() => {
    console.log("Database Connected");
    app.listen(myPort, () => {
      console.log(`server is running on ${myPort}`);
    });
  })
  .catch(() => {
    console.log("Database Not Connected");
  });
