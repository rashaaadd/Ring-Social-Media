const express = require('express');
const router = express.Router();
const adminProtect = require('../middleware/adminAuthMiddleware')
const {
    adminLogin, 
    getAllUsers,
    changeUserStatus
} = require('../controllers/adminController')

router.post('/login',adminLogin)

router.get('/getusers',getAllUsers)

router.put('/:id',changeUserStatus)


module.exports = router;