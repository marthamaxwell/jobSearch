import User from "../models/userModel.js";

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

export default getAllUsers;
