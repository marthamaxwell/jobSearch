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

jobsRouter.post("/create", authenticate, createJob);
jobsRouter.get("/getAllJobs", getAllJobs);
jobsRouter.get("/:id", getOneJob);
jobsRouter.put("/update/:id", updateJob);
jobsRouter.delete("/delete/:id", deleteJob);

export default jobsRouter;
