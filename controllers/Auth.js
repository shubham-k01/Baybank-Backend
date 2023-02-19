const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const {StatusCodes,ReasonPhrases} = require('http-status-codes')
const {body,validationResult} =require('express-validator')

const login = async(req,res)=>{
    const errors = validationResult(body);
    if(!errors.isEmpty()){
        return res.status(StatusCodes.UNAUTHORIZED).json({err : errors.array()})
    }
    const {email,password} = req.body
    const user = await User.findOne({email:email})
    if(!user){
        // throw new BadRequestError('No user found with this email')
        return res.status(StatusCodes.UNAUTHORIZED).json({msg:'Invalid user'})
    }
    const hashedPass = await bcrypt.compare(password,user.password)
    if(!hashedPass){
        return res.status(StatusCodes.UNAUTHORIZED).json({msg:'Invalid password'})
    }
    const data = {user:
        {id:user.id}
    }
    const authToken = jwt.sign(data,process.env.JWT_SECRET);
    return res.status(StatusCodes.OK).json({authToken})
    
}

module.exports ={login}