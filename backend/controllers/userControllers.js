const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')


const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: "1d"
    })
}

//@desc Register new user
//@route POST /register 
//access /public   
const registerUser = asyncHandler(async(req,res)=>{
    console.log("User registration call reached server")
    const {fname,lname,phone,email, username, password} = req.body
    console.log({fname,lname,phone,email, username, password});
    //Validation
    if( !email || !username || !password || !fname || !lname || !phone){
        res.status(400)
        throw new Error("Please add all fields.")
    }
    const [emailExists, usernameExists, phoneExists] = await Promise.all([
        User.findOne({email}),
        User.findOne({username}),
        User.findOne({phone})
    ])

    if(emailExists){
        res.status(400)
        throw new Error("Email already exists.")
    }
    if(usernameExists){
        res.status(400)
        throw new Error("Email already exists.")
    }
    if(phoneExists){
        res.status(400)
        throw new Error("Email already exists.")
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt);

    //Create User
    const newUser = await User.create({
        fname,
        lname,
        password: hashedPassword,
        email,
        username,
        phone,
    })
    if(newUser){
        res.status(200).json({
            status: "success",
            data: {
                _id : newUser._id,
                fname,
                lname,
                email,
                token:generate
            }
        })
    }
})


module.exports = {
    registerUser
}