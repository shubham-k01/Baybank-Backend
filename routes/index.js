const authRouter = require('./authRouter')
const userRouter = require('./userRouter')
const express = require('express')
const router = express.Router()

router.use('/user',userRouter)
router.use('/auth',authRouter)

router.get('/',(req,res)=>{
    res.status(200).send('Hello World')
})


module.exports = router