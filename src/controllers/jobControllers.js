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
    //BUILD QUERY
    const queryObj = { ...req.query }; 
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    // const allJobs = await Job.find(queryObj);

    //USING THE FILTER OBJECT
    // const allJobs = await Job.find({title: "sales consultant"});

    //USING SPECIAL MONGOOSE METHODS
    // const allJobs  = await Job.find().where("title").equals("sales consultant")

    //ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    console.log(JSON.parse( queryStr));

    //EXECUTE QUERY
    const query = await Job.find(JSON.parse(queryStr));
    const job = await query;
    console.log("QUERY:", req.query, "QUERY OBJECT:", queryObj);

    //SORTING
    if(req.query.sort){
      
    }

      //SEND RESPONSE
    res.status(201).json({
      success: true,
      message: "Jobs found",
      result: job.length,
      data: {
        allJobs: job,
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
