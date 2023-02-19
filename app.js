require('dotenv').config();
require('express-async-errors')
const express = require('express')
const cors = require('cors')
const statCode = require('http-status-codes')
// const authRouter = require('./routes/authRouter')
// const userRouter = require('./routes/userRouter')
const router = require('./routes')

const connectDb = require('./connectDb');
const { default: mongoose } = require('mongoose');

const port = process.env.PORT || 3000
const app = express();

mongoose.set('strictQuery',true);
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cors())

// Using middlewares according to the routes
app.use('/',router)
// app.use('/auth',authRouter);
// app.use('/user',userRouter);


app.listen(port,()=>{
    try {
        connectDb(process.env.MONGO_URI);
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log('Error occured');
    }
})