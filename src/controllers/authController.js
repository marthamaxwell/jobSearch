import { promisify } from "util";
import validator from "validator";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../utilis/catchAsync.js";
import AppError from "../utilis/AppError.js";

const signTonken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};
//REGISTER USER
const regUSer = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirmed } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirmed,
  });

  const token = await signTonken(user._id);

  res.status(201).json({
    success: true,
    message: "User created Successfully",
    token,
    data: user,
  });
});

//LOGIN USER
const loginUser = catchAsync(async (req, res, next) => {
  //check for email and password
  const { password, email } = req.body;
  if (!email || !password) {
    return next(new AppError("please provide valid email and password", 400));
  }

  //check if user exists and password is correct
  const user = await User.findOne({ email });

  if (!user || !(await bcryptjs.compare(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //create user's token
  const token = await signTonken(user._id);

  return res.status(201).json({
    success: true,
    message: "logged in successfully",
    token,
    user: user,
  });
});

const protect = catchAsync(async (req, res, next) => {
  let token;

  // if (!req.headers || !req.headers.authorization) {
  //   return next(new AppError("Authorization header is missing", 400));
  // }
  //checks hearders and correctly extract token from request headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  //verify token
  const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //check if user still exists
  next();
});

//VALIDATE USER
//LOG OUT USER
//VERIFY USER EMAIL
//CHANGE USER PASSWORD
//DELETE USER PROFILE
//UPDATE USER DETAILS
//FORGOT PASSWORD

export { regUSer, loginUser, protect };
