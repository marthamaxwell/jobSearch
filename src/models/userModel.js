import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email already in use... Provide another email"],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },

  photo: { type: String },

  password: {
    type: String,
    trim: true,
    required: true,
    minLength: 8,
  },

  passwordConfirmed: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords do not match",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcryptjs.hash(this.password, 12);

  this.passwordConfirmed = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
