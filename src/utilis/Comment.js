const getAllJobs = async (req, res) => {
    try {
      //BUILD QUERY
      
      // const allJobs = await Job.find(queryObj);
  
      //USING THE FILTER OBJECT
      // const allJobs = await Job.find({title: "sales consultant"});
  
      //USING SPECIAL MONGOOSE METHODS
      // const allJobs  = await Job.find().where("title").equals("sales consultant")
  
      // const queryObj = { ...req.query }; 
      // const excludedFields = ["page", "sort", "limit", "fields"];
      // excludedFields.forEach((el) => delete queryObj[el]);
  
      //ADVANCED FILTERING
      // let queryStr = JSON.stringify(queryObj)
      // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
      // console.log(JSON.parse( queryStr));
  
      
      //CREATE QUERY
      // let query = Job.find(JSON.parse(queryStr));
     
      //SORTING
      // if(req.query.sort){
      //   const sortBy = req.query.sort.split(",").join(" ")
      //   console.log(sortBy);
      // query= query.sort(req.query.sort)
      // }else{
      //   query = query.sort("-createdAt")
      // }
  
      //FIELD LIMITING
      //  if(req.query.fields){
      //   const field = req.query.fields.split(",").join(" ");
      //   query= query.select(field)
      //  }else{
      //   query=query.select("-__v")
      //  }
  
  
       //PAGINATION 
      //  const page = req.query.page * 1 || 1;
      //  const limit = req.query.limit * 1 || 100;
      //  const skip = (page - 1) * limit
      //  query = query.skip(skip).limit(limit)
  
      //  if(req.query.page){
      //   const numJobs = await Job.countDocuments();
      //   if(skip >= numJobs) throw new Error("Page doesn't exists")
      //  }
     
  
  
      //EXECUTE QUERY
      const features = new ApiFeatures(Job.find(), req.query)
  .filter().sort().limitFields().paginate()
      const job = await features.query.exec()
      // console.log("QUERY:", features.query);
      // console.log("QUERY:", req.query, "QUERY OBJECT:", queryObj);
  
  
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
        message: "Job not found",
        error: error.message,
      });
    }
  };