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
      res.staus(400).json({
        message: `Email ${email} already in use`,
      });
    }

    if (!validator.isStrongPassword(password)) {
      res.staus(400).json({
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
//VALIDATE USER
//LOG OUT USER
//VERIFY USER EMAIL
//CHANGE USER PASSWORD
//DELETE USER PROFILE
//UPDATE USER DETAILS

export { regUSer };
