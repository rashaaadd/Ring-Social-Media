const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = asyncHandler(async(req,res,next) => {
    console.log("Kannapii Auth middleware ethi ketto")
    let token;
    console.log(req.headers.authorization,'headeraan kuttooos')
    if(req.headers && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            req.userId = decoded.id
            console.log('User details accessed successfully',req.userId);
            next();
        }catch(e){
            res.status(401)
            throw new Error("User not Authorized");
        }
    }
    if(!token){
        res.status(401)
        throw new Error("No Token Found");
    }
})

module.exports = protect;