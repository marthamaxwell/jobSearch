import express from "express";

import {
  createJob,
  deleteJob,
  getAllJobs,
  getOneJob,
  updateJob,
} from "../controllers/jobControllers.js";
import authenticate from "../middleware/authentication.js";

const jobsRouter = express.Router();

jobsRouter.post("/", createJob);
jobsRouter.get("/", getAllJobs);
jobsRouter.get("/:id", getOneJob);
jobsRouter.patch("/:id", updateJob);

jobsRouter.delete("/:id", deleteJob);

export default jobsRouter;
