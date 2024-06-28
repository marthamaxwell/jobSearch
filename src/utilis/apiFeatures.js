//creating a class
export class ApiFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }

    filter(){
    const queryObj = { ...this.queryString }; 
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
    console.log(JSON.parse( queryStr));

    
    //CREATE QUERY
    this.query=this.query.find(JSON.parse(queryStr))
    // let query = Job.find(JSON.parse(queryStr));
    return this;
   }

   sorting(){
    if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(",").join(" ")
        console.log(sortBy);
      this.query= this.query.sort(req.query.sort)
      }else{
        this.query = this.query.sort("-createdAt")
      }
       return this;
   }
  
   limit(){
    if(req.queryString.fields){
        const field = this.queryString.fields.split(",").join(" ");
        this.query=  this.query.select(field)
       }else{
        query=query.select("-__v")
       }
       return this;
   }

   pagination(){
    const page = this.queryString.page * 1 || 1;
     const limit = this.queryString.limit * 1 || 100;
     const skip = (page - 1) * limit
     query = query.skip(skip).limit(limit)
     return this;
   }
   
}  

