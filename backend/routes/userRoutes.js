const express = require('express');

const router = express.Router()
const {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
    followUser,
    // unFollowUser,
    getAllUsers
} = require('../controllers/userControllers');
const protect = require('../middleware/authMiddleware')

router.post('/register',registerUser);

router.post("/login",loginUser)

router.get('/user',protect,getUser)

router.route('/:id',protect).put(updateUser).delete(deleteUser);

router.get('/allusers',protect,getAllUsers)

router.route('/:id/follow').put(protect,followUser)

// router.route('/:id/unfollow',protect).put(unFollowUser)






module.exports = router;