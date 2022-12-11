const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/connection')
const colors = require('colors')
const cors = require('cors')
const errorHandler = require('./middleware/errorMiddleware')
const userRoute = require('./routes/userRoutes')
const adminRoute = require('./routes/adminRoutes')

const port =  process.env.PORT || 5000

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false })) 

app.use('/',userRoute)
// app.use('/admin',adminRoute)


app.use(errorHandler)

app.listen(port,()=> console.log(`Server connected to port ${port}`))