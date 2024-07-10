import Job from "../models/jobModel.js";
import User from "../models/userModel.js";
import { ApiFeatures } from "../utilis/apiFeatures.js";
import catchAsync from "../utilis/catchAsync.js";
import AppError from "../utilis/appError.js";
//create Job
const createJob = catchAsync(async (req, res, next) => {
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
    salary,
  } = req.body;
  // if (!title || !category || !company || !location || !description) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Required Fields Needed",
  //   });
  // }
  const job = await Job.create({
    title,
    company,
    location,
    description,
    postedDate,
    category,
    salary,
  });

  res.status(201).json({
    success: true,
    message: "Job successfully Created",
    data: job,
  });
});

//READ ALL JOBS
const getAllJobs = catchAsync(async (req, res, next) => {
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
});

//Read a single job
const getOneJob = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const singleJob = await Job.findById(id);
  if (!singleJob) {
    return next(new AppError("job not found", 404));
  }

  res.status(201).json({
    success: true,
    message: "Job found",
    data: singleJob,
  });
});

//update a job
const updateJob = catchAsync(async (req, res, next) => {
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

  if (!job) {
    return next(new AppError("job not found", 404));
  }

  // const updatedJob = job.findByIdAndUpdate(id)
  res.status(200).json({
    success: true,
    message: "job updated succefully",
    data: job,
  });
});

//delete a job
const deleteJob = catchAsync(async (req, res, next) => {
  // if (!req.permission.job.create) {
  //   return res.status(401).json({
  //     message: "You're not allowed to create jobs",
  //   });
  // }
  const { id } = req.params;
  const deletedJob = await Job.findByIdAndDelete(id);
  if (!deletedJob) {
    return next(new AppError("job already deleted", 404));
  }

  res.status(200).json({
    success: true,
    message: "job deleted succefully",
    data: deletedJob,
  });
});

//Get Stats
const getJobsStats = catchAsync(async (req, res, next) => {
  const stats = await Job.aggregate([
    {
      $match: { salary: { $gte: 50 } },
    },
    {
      $group: {
        _id: { $toUpper: "$location" },
        numJobs: { $sum: 1 },
        avgSalary: { $avg: "$salary" },
        minSalary: { $min: "$salary" },
        maxSalary: { $max: "$salary" },
      },
    },
    {
      $sort: {
        avgSalary: 1,
      },
    },
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
    data: { stats: stats },
  });
});

//Get Monthly Job Statistics
const getMonthlyJobs = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const monthlyJobs = await Job.aggregate([
    {
      $match: {
        postedDate: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$postedDate" },
        numJobs: { $sum: 1 },
        jobs: { $push: "$title" },
      },
    },

    {
      $addFields: {
        month: "$_id",
      },
    },

    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numJobs: 1,
      },
    },
    {
      $limit: 2,
    },
  ]);

  res.status(200).json({
    success: true,
    message: "Job stats",
    data: { mjobs: monthlyJobs },
  });
});

export {
  createJob,
  getAllJobs,
  getOneJob,
  updateJob,
  deleteJob,
  getJobsStats,
  getMonthlyJobs,
};
