import Job from "../models/jobModel.js";
import User from "../models/userModel.js";

//create Job

const createJob = async (req, res) => {
  try {
    // if (!req.permission.job.create) {
    //   return res.status(401).json({
    //     message: "You're not allowed to create jobs",
    //   });
    // }

    const {
      title,
      category,
      company,
      location,
      description,
      postedDate,
      User,
    } = req.body;
    if (!title || !category || !company || !location || !description) {
      return res.status(400).json({
        success: false,
        message: "Required Fields Needed",
      });
    }
    const job = await Job.create({
      title,
      company,
      location,
      description,
      postedDate,
      category,
    });

    res.status(201).json({
      success: true,
      message: "Job successfully Created",
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Job not created",
      error: error.message,
    });
  }
};

//Read all jobs
const getAllJobs = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort, limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log("query:", req.query, "query obj:", queryObj);

    const allJobs = await Job.find().where("title").equals("frontend dev");
    res.status(201).json({
      success: true,
      message: "Jobs found",
      result: allJobs.length,
      data: {
        allJobs: allJobs,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Job not found found",
      error: error.message,
    });
  }
};

//Read a single job
const getOneJob = async (req, res) => {
  try {
    const { id } = req.parms;
    const singleJob = await Job.findById(id).populate({
      path: "User",
      select: "fullName",
    });
    res.status(201).json({
      success: true,
      message: "Job found",
      data: singleJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Job not found found",
      error: error.message,
    });
  }
};

//update a job
const updateJob = async (req, res) => {
  try {
    // if (!req.permission.job.create) {
    //   return res.status(401).json({
    //     message: "You're not allowed to create jobs",
    //   });
    // }
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    // const updatedJob = job.findByIdAndUpdate(id)
    res.status(200).json({
      success: true,
      message: "job updated succefully",
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Job not uppdated ",
      error: error.message,
    });
  }
};

//delete a job
const deleteJob = async (req, res) => {
  try {
    // if (!req.permission.job.create) {
    //   return res.status(401).json({
    //     message: "You're not allowed to create jobs",
    //   });
    // }
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "job deleted succefully",
      data: deletedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Job not deleted",
      error: error.message,
    });
  }
};

export { createJob, getAllJobs, getOneJob, updateJob, deleteJob };
