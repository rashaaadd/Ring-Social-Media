const asyncHandler = require("express-async-handler");
const { cloudinary } = require("../utils/cloudinary");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

//@desc Add new post
//@route POST /create
//@access Private
const newPost = asyncHandler(async (req, res) => {
  console.log("New post creation call reached at server.")
  const image = req.file;
  const { desc } = req.body;
  const userId = req.userId;
  if (!desc || !image) {
    res.status(404);
    throw new Error("Upload data not found.");
  }
  try {
    const result = await cloudinary.uploader.upload(image?.path, {
      upload_preset: "ring-cloud",
    });
    const user = await User.findById({ _id: userId });
    let post = await Post.create({
      userId,
      userName: user.name,
      desc,
      images: result.secure_url,
      cloudinary_id: result.public_id,
      time: new Date().toUTCString(),
    });
    post = await Post.findById(post._id).populate('userId')
    console.log(post,'post created at server')
    user.posts.push(post._id);
    const userData = await user.save();
    res.status(200).json({
      status: "success",
      data: post,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error uploading file");
  }
});

//@desc Edit post
//@route PUT /:id
//@access Private

const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId  = req.userId;
  try {
    const post = await Post.findById(postId);
    if (userId == post.userId) {
      const updatedPost = await post.updateOne({ $set: req.body });
      res.status(200).json({
        status: "success",
        data: updatedPost,
        message: "Post Updated Successfully.",
      });
    } else {
      res.status(403);
      throw new Error("Access Forbidden.");
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error updating post");
  }
});

//@desc Delete post
//@route DELETE /:id
//@access Private

const deletePost = asyncHandler(async (req,res) => {
    const postId = req.params.id;
    const {userId} = req.body
    try{
        const post = await Post.findById(postId);
        if(userId == post.userId){
            await post.deleteOne();
            res.status(200).json({
                status:'success',
                message: 'Post deleted successfully.'
            })
        }else{
            res.status(403)
            throw new Error("Access Forbidden.")
        }
    }catch(error){
        console.log(error)
        res.status(500)
        throw new Error("Error deleting post.")
    }
})

//@desc Get user timeline
//@route PUT /:id/timeline
//access /private

const getTimelinePosts = asyncHandler(async (req,res) => {
    const userId = req.userId
    console.log(req.params.id,'hellooooo seerr.. big ffan serr')
    try{
        const userPosts = await Post.find({userId}).populate('userId')
        const followingPosts = await User.aggregate([
          {
            $match:{
              _id:new mongoose.Types.ObjectId(userId),
            }
          },
          {
            $lookup:{
              from: 'posts', 
              localField: 'following',
              foreignField: 'userId',
              as: 'result'
            }
          }, 
          {
            $unwind:'$result'
          },
          {
            $project:{
              _id:'$result._id',
              userId:'$result.userId',
              desc:'$result.desc',
              images:'$result.images',
              cloudinary_id:'$result.cloudinary_id',
              like:'$result.likes',
              comments:'$result.comments',
              createdAt:'$result.createdAt',
              updatedAt:'$result.updatedAt'
            }
          },
          {
            $lookup:{
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userId'
            }
          },
          {
            $unwind:'$userId',  
          }    
        ])
        console.log(userPosts,'.......userPosts')
        console.log(followingPosts,'.........followingPosts')
        const data = userPosts.concat(followingPosts).sort((a,b) => b.createdAt - a.createdAt )
        console.log(data,'dataaa')
        res.json({
          status : 'success',
          message: 'Timeline posts fetched.',  
          data:data   
        })
    }catch(error){
        console.log(error)
        res.status(500)
        throw new Error("Error getting timeline posts.")
    } 
})


//@desc Get all Posts
//@route POST /post/allposts
//@access Private
const getAllPosts = asyncHandler(async (req, res) => {
  console.log("Get all posts call reached server.");
  try {
    const userId = req.userId;
    console.log(userId, "UserId at get all posts");
    const posts = await Post.find({})
      .limit(5)
      .sort({ createdAt: -1 })
      .populate("userId");
    console.log(posts, "all post retrieved");
    res.status(200).json({
      status: "success",
      data: posts,  
      message: "All posts fetched successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error("Error getting all posts.");
  }
});

module.exports = {
  newPost,
  getAllPosts,
  updatePost,
  deletePost,
  getTimelinePosts
};
