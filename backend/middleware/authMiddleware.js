const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const protect = asyncHandler(async(req,res,next) => {
    let token;
    if(req.headers && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            //user block check need to be worked
            req.userId = decoded.id
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