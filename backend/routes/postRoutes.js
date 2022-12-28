const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { 
    newPost,
    getAllPosts ,
    updatePost,
    deletePost,
    getTimelinePosts,
    likePost,
    getProfilePosts
} = require('../controllers/postController');

const protect = require('../middleware/authMiddleware');

router.post('/create',protect,upload.single('image'),newPost)

router.route('/:id',protect).put(protect,updatePost).delete(protect,deletePost)

router.get('/allposts',protect,getAllPosts)

router.get('/profile-posts/:id',protect,getProfilePosts)

router.get('/timeline',protect,getTimelinePosts)

router.put('/:id/like',protect,likePost)



module.exports = router;