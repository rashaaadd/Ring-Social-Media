const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// const
//Path /admin

//Generate Token for admin
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//@desc admin login
//@route POST /login
//@access /private
const adminLogin = asyncHandler(async (req, res) => {
  const admin = {
    username: "admin",
    password: "admin123",
  };
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("Enter all details");
  }
  if (username == admin.username && password == admin.password) {
    res.status(200);
    return res.json({
      status: "success",
      message: "Admin Login successful.",
      token: generateToken(admin.username),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials.");
  }
});

//@desc Get all users
//@route GET /getusers
//@access /private
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      message: "Users data retrieved successfully.",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error getting all users");
  }
});

const changeUserStatus = asyncHandler(async (req, res) => {

  const userId = req.params.id;
  if (!userId) {
    res.status(400);
    throw new Error("Error getting parameters.");
  }
  const user = await User.findById(userId);
  if (!user) {
    res.status(400);
    throw new Error("User not found.");
  }
  console.log(user,'user befre update')
  user.isBlocked = !user.isBlocked;
  await user.save();
  console.log(user,'user data after update')
  res.status(200).json({
    status: "success",
    message: "User updated successfully.",
    data:user
  })
});

module.exports = {
  adminLogin,
  getAllUsers,
  changeUserStatus,
};
