import validator from "validator";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

//REGISTER USER
const regUSer = async (req, res) => {
  try {
    const { fullName, email, password, gender, role, permissions, profile } =
      req.body;
    if (!fullName || !email || !password) {
      res.send("input required fields");
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({
        message: `Email ${email} already in use`,
      });
    }

    if (!validator.isStrongPassword(password)) {
      res.status(400).json({
        message: `Weak password: Your password must include lowercase, uppercase, digits, symbols and must be at least 8 characters`,
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const registeredUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      gender,
      role,
      profile,
      permissions,
    });

    const token = jwt.sign(
      {
        _id: registeredUser.id,
        email: registeredUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    registeredUser.auth.token = token;
    await registeredUser.save();

    res.status(201).json({
      success: true,
      message: "User created Successfully",
      data: registeredUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User not created",
      error: error.message,
    });
  }
};

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
