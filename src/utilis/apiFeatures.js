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

   sort(){
    if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(",").join(" ")
        console.log(sortBy);
      this.query= this.query.sort(sortBy)
      }else{
        this.query = this.query.sort("-createdAt")
      }
       return this;
   }
  
   limitFields(){
    if(this.queryString.fields){
        const field = this.queryString.fields.split(",").join(" ");
        this.query=  this.query.select(field)
       }else{
        this.query= this.query.select("-__v")
       }
       return this;
   }

   paginate(){
    const page = this.queryString.page * 1 || 1;
     const limit = this.queryString.limit * 1 || 100;
     const skip = (page - 1) * limit
     this.query =  this.query.skip(skip).limit(limit)
     return this;
   }
   
}  

