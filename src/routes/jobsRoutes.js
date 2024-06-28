import express from "express";

import {

  createJob,
  deleteJob,
  getAllJobs,
  getOneJob,
  updateJob,
} from "../controllers/jobControllers.js";
import { aliasTopJobs } from "../middleware/aliasTopJobs.js";

const jobsRouter = express.Router();

jobsRouter.post("/", createJob);
jobsRouter.get("/top2", aliasTopJobs,getAllJobs);
jobsRouter.get("/",getAllJobs);
jobsRouter.get("/:id", getOneJob);
jobsRouter.patch("/:id", updateJob);
jobsRouter.delete("/:id", deleteJob);

export default jobsRouter;
