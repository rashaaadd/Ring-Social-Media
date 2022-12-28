const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { cloudinary } = require("../utils/cloudinary");
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_ID } =
  process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

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
    throw new Error("Username already exists.");
  }
  if (phoneExists) {
    res.status(400);
    throw new Error("Phone already exists.");
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
        phone,
      },
      message: "User created successfully",
    });
  } else {
    res.status(400);
    throw new Error("User creation failed.");
  }
});

//@desc Get phone for Twilio
//@route POST /password/reset
//access /public
const getOTP = asyncHandler(async (req, res) => {
  console.log("GET OTP CALL AT SERVER")
  console.log(req.body, "req bodyyyyyy");
  const { phone } = req.body;
  if (!phone) {
    res.status(400);
    throw new Error("Please add all fields.");
  }
  const user = await User.findOne({ phone });
  if (!user) {
    res.status(400);
    throw new Error("Phone number not registered.");
  }
  const otpResponse = await client.verify
    .services(TWILIO_SERVICE_ID)
    .verifications.create({
      to: `+91${user.phone}`,
      channel: "sms",
    });

  res.status(200).json({
    status: "success",
    data: user,
    message: "An OTP has beeen sent to your phone number.",
  });
});

//@desc Verify OTP
//@route POST /verify-user
//access /public

const verifyOTP = asyncHandler(async (req, res) => {
  console.log("VERIFY OTP CALL AT SERVER")
  console.log(req.body, "req bodyyyyyy");
  const { otp1, otp2, otp3, otp4, otp5, otp6, userData } = req.body;
  const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
  console.log(otp, "otppppp");
  if (!otp || otp.length !== 6) {
    res.status(400);
    throw new Error("Please add all fields.");
  }
  const verifiedRes = await client.verify
    .services(TWILIO_SERVICE_ID)
    .verificationChecks.create({
      to: `+91${userData?.phone}`,
      code: otp,
    });

  if (!verifiedRes.valid) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  res.status(200).json({
    status: "success",
    message: "OTP verified successfully",
    data: userData._id,
  });
});

//@desc Change password
//@route POST /reset-password/:id
//access public

const resetPassword = asyncHandler(async (req, res) => {
  console.log("RESET PASSWORD CALL AT SERVER")
  const userId = req.params.id;
  const { password } = req.body;
  console.log(userId, "............", password);
  if (!userId || !password) {
    res.status(400);
    throw new Error("Please add all fields.");
  }
  const user = await User.findById(userId);
  console.log(user, "userrrrrrr11");
  if (!user) {
    res.status(400);
    throw new Error("User not found.");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const updatedUser = await User.findByIdAndUpdate(userId, {
    $set: { password: hashedPassword },
  });
  console.log("user password updated");
  if (!updateUser) {
    res.status(400);
    throw new Error("Error updating user.");
  }
  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
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

  const user = await User.findOne({ email }).select("+password");
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
  console.log("GET USER CALL AT SERVER")
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.status(201).json({
        status: "success",
        data: {
          user,
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

//@desc Update user
//@route PUT /:id
//access /private

const updateUser = asyncHandler(async (req, res) => {
  console.log("UPDATE USER AT SERVER")
  const userId = req.params.id;
  const profilePic = req.files.profile[0]
  const coverPic = req.files.cover[0];

  if (!userId) {
    res.status(400);
    throw new Error("User data not acquired");
  }
  if (userId !== req.userId) {
    res.status(500);
    throw new Error("Access denied.");
  }
  if(!profilePic || !coverPic || !req.body) {
    res.status(400);
    throw new Error("Please add all fields.");
  }

  const profileResult = await cloudinary.uploader.upload(profilePic?.path, {
    upload_preset: "ring-cloud",
  });
  const coverResult = await cloudinary.uploader.upload(coverPic?.path, {
    upload_preset: "ring-cloud",
  });
  req.body.profile_cloudinary_id = profileResult.public_id
  req.body.cover_cloudinary_id = coverResult.public_id
  req.body.profilePic = profileResult?.secure_url
  req.body.coverPic = coverResult?.secure_url
  const details = {}
  details.dob = req.body.dob? req.body.dob : null
  details.relation = req.body.relation? req.body.relation : null
  details.bio = req.body.bio? req.body.bio : null
  details.work = req.body.work? req.body.work : null
  details.gender = req.body.gender? req.body.gender : null
  details.city = req.body.city? req.body.city : null
  details.country = req.body.country? req.body.country : null
  req.body.details = details
  
  const user = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });
  console.log(user,'dsashahsdk')
  if(user){
    res.status(201).json({
      status: "success",
      data: user,
      message: "User updated successfully",
    });
  }else{
    console.log(error);
    res.status(502);
    throw new Error("Error updating user.");
  }
  
});

//@desc Delete user
//@route DELETE /user
//access /private
const deleteUser = asyncHandler(async (req, res) => {
  console.log('DELETE USER AT SERVER')
  const userId = req.params.id;

  // if(userId === req.user._id){
  try {
    const user = await User.findByIdAndRemove(userId);
    if (user) {
      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
      });
    } else {
      res.status(404);
      throw new Error("User not found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error deleting user");
  }
  // }else{
  //   res.status(500)
  //     throw new Error("Access denied")
  // }
});

//@desc Follow a user
//@route PUT /follow/:id
//access /private
const followUser = asyncHandler(async (req, res) => {
  console.log('FOLLOW/UNFOLLOW USER AT SERVER')
  const followUserId = req.params.id;
  const userId = req.userId;
  if (userId === followUserId) {
    res.status(403);
    throw new Error("Action forbidden");
  } else {
    try {
      const followUser = await User.findById(followUserId);
      const user = await User.findById(userId);

      if (!followUser.followers.includes(userId)) {
        await followUser.updateOne({ $push: { followers: userId } });
        await user.updateOne({ $push: { following: followUserId } });
        res.status(200).json({
          status: "success",
          message: "User followed successfully.",
        });
      } else {
        await followUser.updateOne({ $pull: { followers: userId } });
        await user.updateOne({ $pull: { following: followUserId } });
        res.status(200).json({
          status: "success",
          message: "User unfollowed successfully.",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500);
      throw new Error("Error following user");
    }
  }
});

//@desc Get all users
//@route GET /allusers
//access /public

const getAllUsers = asyncHandler(async (req, res) => {
  console.log('GET ALL USER AT SERVER')
  const userId = req.userId;
  try {
    const users = await User.find({ _id: { $ne: userId } });
    res.status(200).json({
      status: "success",
      message: "Users found",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error getting all users");
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  getAllUsers,
  getOTP,
  verifyOTP,
  resetPassword,
};
