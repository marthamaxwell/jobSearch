import express from "express";

import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobsStats,
  getMonthlyJobs,
  getOneJob,
  updateJob,
} from "../controllers/jobControllers.js";
import { aliasTopJobs } from "../middleware/aliasTopJobs.js";

const jobsRouter = express.Router();

jobsRouter.post("/", createJob);
jobsRouter.get("/top2", aliasTopJobs, getAllJobs);
jobsRouter.get("/", getAllJobs);
jobsRouter.get("/stats", getJobsStats);
jobsRouter.get("/monthlyJobs/:year", getMonthlyJobs);
jobsRouter.get("/:id", getOneJob);
jobsRouter.put("/:id", updateJob);
jobsRouter.delete("/:id", deleteJob);

export default jobsRouter;
