const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//@desc Register new user
//@route POST /register
//access /public
const registerUser = asyncHandler(async (req, res) => {
  console.log("User registration call reached server");
  const { fname, lname, phone, email, username, password } = req.body;
  console.log({ fname, lname, phone, email, username, password });
  //Validation
  if (!email || !username || !password || !fname || !lname || !phone) {
    res.status(400);
    throw new Error("Please add all fields.");
  }
  const [emailExists, usernameExists, phoneExists] = await Promise.all([
    User.findOne({ email }),
    User.findOne({ username }),
    User.findOne({ phone }),
  ]);

  if (emailExists) {
    res.status(400);
    throw new Error("Email already exists.");
  }
  if (usernameExists) {
    res.status(400);
    throw new Error("Email already exists.");
  }
  if (phoneExists) {
    res.status(400);
    throw new Error("Email already exists.");
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create User
  const newUser = await User.create({
    fname,
    lname,
    password: hashedPassword,
    email,
    username,
    phone,
  });
  if (newUser) {
    res.status(200).json({
      status: "success",
      data: {
        _id: newUser._id,
        fname,
        lname,
        email,
        token: generateToken(newUser._id),
      },
      message: "User created successfully",
    });
  } else {
    res.status(400);
    throw new Error("User creation failed.");
  }
});

//@desc Authenticate User
//@route POST /login
//access /public
const loginUser = asyncHandler(async (req, res) => {
  console.log("User login call reached server");
  const { email, password } = req.body;

  //Validation
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields.");
  }

  const user = await User.findOne({ email }).select('+password');
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      status: "success",
      data: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        token: generateToken(user._id),
      },
      message: "User Login Successfull",
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials.");
  }
});

//@desc Get user details
//@route GET /user
//access /private
const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.status(201).json({
        status: "success",
        data: {
          user
        },
        message: "Authorisation successfull",
      });
    }
  } catch (e) {
    console.log(e, "error getting user data");
    res.status(501);
    throw new Error("Error getting user data");
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
};
