import validator from "validator";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../utilis/catchAsync.js";

//REGISTER USER
const regUSer = catchAsync(async (req, res) => {
  const registeredUser = await User.create(req.body);

  res.status(201).json({
    success: true,
    message: "User created Successfully",
    data: registeredUser,
  });
});

//LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid user",
      });
    }

    const token = jwt.sign(
      {
        _id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    user.auth.token = token;
    await user.save();
    return res.status(201).json({
      success: true,
      message: "logged in successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "login unsuccessful",
      error: error.message,
    });
  }
};

//Get All Users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({
      success: true,
      message: "All users retrieved",
      data: allUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User not created",
      error: error.message,
    });
  }
};

//VALIDATE USER
//LOG OUT USER
//VERIFY USER EMAIL
//CHANGE USER PASSWORD
//DELETE USER PROFILE
//UPDATE USER DETAILS
//FORGOT PASSWORD

export { regUSer, loginUser, getAllUsers };
