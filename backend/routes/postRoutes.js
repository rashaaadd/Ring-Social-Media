const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { 
    newPost,
    getAllPosts ,
    updatePost,
    deletePost,
    getTimelinePosts
} = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');



router.post('/create',protect,upload.single('image'),newPost)

router.route('/:id',protect).put(updatePost).delete(deletePost)

router.get('/allposts',protect,getAllPosts)

router.get('/timeline',protect,getTimelinePosts)



module.exports = router;