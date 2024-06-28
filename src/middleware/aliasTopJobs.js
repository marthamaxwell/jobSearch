export const aliasTopJobs = (req, res, next)=>{
    req.query.limit = "2";
    req.query.sort = "salary";
    req.query.fields = "title, company, salary";
    next()
  
  }