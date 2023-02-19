const jwt = require('jsonwebtoken')
const {StatusCodes,ReasonPhrases} =require('http-status-codes')
const User = require('../models/User');

const fetchUser = async(req,res,next)=>{
    const token = req.headers.authorization;
    if(!token || !token.startsWith('Bearer')){
        return res.status(StatusCodes.UNAUTHORIZED).json({msg:'Invalid token'})
    }
    const authToken = token.split(' ')[1]
    try{
        const payload = jwt.verify(authToken, process.env.JWT_SECRET)
        // attach the user to the job routes
        req.user = { id: payload.user.id}
        next()
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'Authentication invalid'})
    }
}
module.exports = fetchUser