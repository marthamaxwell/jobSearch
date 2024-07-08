import mongoose from "mongoose";
import slugify from "slugify";

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    postedDate: { type: Date, default: Date.now },
    salary: { type: Number, default: 0, required: true },
    slug: String,
    // Image: { type: String },
    // Tags: [{ type: String }],
    // ApplicationLink: { type: String },
    // Views: { type: Number, default: 0 },
    // User: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.virtual("annualSalary").get(function () {
  return this.salary * 12;
});

//DOCUMENT MIDDLEWARE
jobSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lowercase: true });
  next();
});

jobSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
