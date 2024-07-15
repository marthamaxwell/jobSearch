import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import expressSanitizer from "express-sanitizer";
import morgan from "morgan";
import AppError from "./src/utilis/appError.js";
import globalErrorHandler from "./src/controllers/errorController.js";
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

// Catch-all route handler for undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error-handling middleware
app.use(globalErrorHandler);

mongoose.connect(dataBase).then(() => {
  try {
    console.log("Database Connected");
    app.listen(myPort, () => {
      console.log(`server is running on ${myPort}`);
    });
  } catch (err) {
    console.log("Database Not Connected");
  }
});

// process.on("unhandledRejection", (err) => {
//   console.log("UNHANDLED REJECTION! Shutting down...");
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
