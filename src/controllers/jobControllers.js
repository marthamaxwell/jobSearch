import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
import { ApiFeatures } from "../utilis/apiFeatures.js";



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
      salary
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
      salary
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



//READ ALL JOBS
const getAllJobs = async (req, res) => {
  try {
    // Create an instance of ApiFeatures to handle filtering, sorting, etc.
    const features = new ApiFeatures(Job.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query
    const jobs = await features.query;

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No jobs found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Jobs found",
      result: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


//Read a single job
const getOneJob = async (req, res) => {
  try {
    const { id } = req.params;
    const singleJob = await Job.findById(id)
    res.status(201).json({
      success: true,
      message: "Job found",
      data: singleJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Job not found",
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

//Get Stats
const getJobsStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $match: { salary: { $gte: 50 } }
      },
      {
        $group: {
          _id: "$location",
          numJobs:{$sum: 1},
          avgSalary: { $avg: "$salary" },
          minSalary: { $min: "$salary" },
          maxSalary: { $max: "$salary" }
        },
      },
      {
        $sort:{
          avgSalary: -1
        }
      }
    ]);

    if (!stats || stats.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching job stats found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job stats",
      data:{stats: stats}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};





export { createJob, getAllJobs, getOneJob, updateJob, deleteJob, getJobsStats};
