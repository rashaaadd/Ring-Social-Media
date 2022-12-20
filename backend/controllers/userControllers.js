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
  console.log(emailExists,usernameExists,phoneExists),'................';

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

//@desc Update user 
//@route PUT /user
//access /private

const updateUser = asyncHandler(async(req,res) => {
  const userId = req.params.id
  console.log(req.body,'...............',userId)
  // if( userId === req.user._id){
    try {
      const user = await User.findByIdAndUpdate(userId, req.body, {new:true})
      res.status(201).json({
        status: 'success',
        data: user,
        message:'User updated successfully'
      })
    } catch (error) {
      console.log(error)
      res.status(502)
      throw new Error("Error updating user.")
    }
  // }else{
  //   res.status(500)
  //   throw new Error("Access denied.")
  // }
})

//@desc Delete user 
//@route DELETE /user
//access /private
const deleteUser = asyncHandler(async (req,res) => {
  const userId = req.params.id

  // if(userId === req.user._id){
    try {
      const user = await User.findByIdAndRemove(userId)
      if(user){
        res.status(200).json({
          status: 'success',
          message: "User deleted successfully"
        })
      }else{
        res.status(404);
        throw new Error("User not found.");
      }
      
    } catch (error) {
      console.log(error)
      res.status(500)
      throw new Error("Error deleting user")
    }
  // }else{
  //   res.status(500)
  //     throw new Error("Access denied")
  // }
})

//@desc Follow a user 
//@route PUT /follow/:id
//access /private
const followUser = asyncHandler(async(req,res) => {
  const followUserId = req.params.id
  const userId = req.userId 
  console.log(followUserId,'.........',userId)
  if(userId === followUserId){
    res.status(403)
    throw new Error("Action forbidden")
  }else{
    try {
      const followUser = await User.findById(followUserId)
      console.log(followUser,'follow user is the here aliya');
      const user = await User.findById(userId)
      console.log(user,'current user is the here aliya');

      if(!followUser.followers.includes(userId)){
        await followUser.updateOne({$push:{followers: userId}})
        await user.updateOne({ $push : { following: followUserId}})
        res.status(200).json({
          status: 'success',
          message: 'User followed successfully.'
        })
      }else{
        await followUser.updateOne({$pull:{followers: userId}})
        await user.updateOne({ $pull : { following: followUserId}})
        res.status(200).json({
          status: 'success',
          message: 'User unfollowed successfully.'
        })
      }
    } catch (error) {
      console.log(error)
      res.status(500)
      throw new Error("Error following user")
    }
  }
})


//@desc Unfollow a user 
//@route PUT /unfollow/:id
//access /private
// const unFollowUser = asyncHandler(async(req,res) => {
//   const followUserId = req.params.id
//   const {userId} = req.body 
//   if(userId === followUserId){
//     res.status(403)
//     throw new Error("Action forbidden")
//   }else{
//     try {
//       const followUser = await User.findById(followUserId)
//       const user = await User.findById(userId)
//       if(followUser.followers.includes(userId)){
//         await followUser.updateOne({$pull:{followers: userId}})
//         await user.updateOne({ $pull : { following: followUserId}})
//         res.status(200).json({
//           status: 'success',
//           message: 'User unfollowed successfully.'
//         })
//       }else{
//         res.status(403).json({message:"User is not followed."})
//         throw new Error("User is not followed.")
//       }
//     } catch (error) {
//       console.log(error)
//       res.status(500)
//       throw new Error("Error following user")
//     }
//   }
// })


//@desc Get all users 
//@route GET /allusers
//access /public

const getAllUsers = asyncHandler(async(req,res) => {
  const userId = req.userId
  try {
    const users = await User.find({_id: {$ne: userId}})
    res.status(200).json({
      status:'success',
      message: 'Users found',
      data: users
    })
  } catch (error) {
    console.log(error)
    res.status(500)
    throw new Error("Error getting all users")
  }
})

 

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  // unFollowUser,
  getAllUsers
};
