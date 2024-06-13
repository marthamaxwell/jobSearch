import Job from "../models/jobModel";

//create Job

const createJob = async (req, res) => {
  try {
    if (!req.permission.job.create) {
      return res.status(401).json({
        message: "You're not allowed to create jobs",
      });
    }

    const { title, company, location, description, postedDate, postedBy } =
      req.body;
    if (!title || !company || !location || !description || !postedBy) {
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
      postedBy: req.user._id,
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

//Read all job
const getAllJobs = async (req, res) => {
  try {
    const allJobs = await Job.find();
    res.status(201).json({
      success: true,
      message: "Jobs found",
      data: allJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "not found",
      error: error.message,
    });
  }
};

//Read a single job
const getOneJob = async (req, res) => {
  const { id } = req.parms;
  const singleJob = await Job.findOneById;
};

//update a job
//delete a job

export { createJob, getAllJobs, getOneJob };
