const express = require('express');
const upload = require('../utils/multer');

const router = express.Router()
const {
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
    getFollowingUsers,
    getFollowersUsers
} = require('../controllers/userControllers');


const protect = require('../middleware/authMiddleware')

router.post('/register',registerUser);

router.post('/password/reset',getOTP);

router.post('/reset-password/:id',resetPassword);

router.post('/verify-user',verifyOTP)

router.post("/login",loginUser)

router.get('/user',protect,getUser)

router.post('/:id',protect,upload.fields([{
    name:'profile',
    maxCount:1  
},{
    name:'cover',
    maxCount:1
}]),updateUser)

// router.route('/:id',protect).delete(deleteUser);

router.get('/allusers',protect,getAllUsers)

router.route('/:id/follow').put(protect,followUser)

router.get('/:id/following-users',protect,getFollowingUsers)

router.get('/:id/follower-users',protect,getFollowersUsers)








module.exports = router;