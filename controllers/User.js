const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {StatusCodes,ReasonPhrases} = require('http-status-codes')
const {body,validationResult} =require('express-validator')
const Transaction = require('../models/Transaction')
var crypto = require('crypto')
var format = require('biguint-format');
const bcrypt = require('bcryptjs');

function randomC (qty) {
    var x= crypto.randomBytes(qty);
    return format(x, 'dec');
}
function random (low, high) {
    return randomC(4)/Math.pow(2,4*8-1) * (high - low) + low;
}

const createUser = async(req,res)=>{
    const errors = validationResult(body)
    if(!errors.isEmpty()){
        console.log(errors);
        // throw new UnauthenticatedError('Please provide valid credentials')
        return res.status(StatusCodes.UNAUTHORIZED).json({err:errors.array()})
    }   
    const {name,email,password,balance} = req.body;
    if(!name || !email || !password || !balance ){
        // throw new BadRequestError('Please provide name, email, balance and password')
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'Please provide name, email, balance and password'})
    }
    const u = await User.findOne({email:email});
    if(u){
        // throw new UnauthenticatedError('User with this email already exists')
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'User with email already exists'})
    }
    else{
        const ran = random(10000,1000000);
        console.log(ran);
        const salt =await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password,salt);
        const user = await User.create({name:name,balance:balance,acc:ran,email,password:hashedPass})
        // res.status(200).json(user);
        const data= {user:
            {id:user.id}
        };
        const authToken = jwt.sign(data,process.env.JWT_SECRET);   
        console.log('User created');
        return res.status(StatusCodes.ACCEPTED).json({authToken});
    }
   
}
// get info about user
const getInfo = async(req,res)=>{
    const {id} = req.user;
    if(!id){
        // throw new BadRequestError('No id present')
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'No id present'})
    }
    // when finding based on the id , write _id not id
    const user = await User.findOne({_id:id}).select("-password");
    if(!user){
        return res.status(StatusCodes.UNAUTHORIZED).json({msg:'User with account number does not exist'})
    }
    console.log(user);
    return res.status(StatusCodes.OK).json(user);
}

// check balance
const checkBal = async(req,res)=>{
    const {id} = req.user
    console.log(id);
    if(!id ){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'Please provide valid credentials'})
    }
    const user = await User.findOne({_id:id});
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'User with account number does not exist'})
    }
    return res.status(StatusCodes.ACCEPTED).json({msg:'Accepted',balance:`Your balance is ${user.balance}`})
    
}

// transaction
const transaction = async(req,res)=>{
    const {id} = req.user
    if(!id){
        return res.status(StatusCodes.UNAUTHORIZED).json({msg:'Please provide valid credentials'})
    }
    let user1 = await User.findOne({_id:id});
    if(!user1){
        return res.status(StatusCodes.UNAUTHORIZED).json({msg:'User with this id does not exist'})
    }
    const {transferTo ,amt} = req.body;
    if(!transferTo || !amt){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'Please provide the second user and the amount'})
    }
    let user2 = await User.findOne({email:transferTo})
    if(!user2){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'User with email does not exist'})
    }
    if(user1==user2){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'Cannot transfer money from same account'})
    }
    console.log(user1.balance);
    if(amt>user1.balance){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'Amount is greater than balance of first user'})
    }
    // saving the transaction
    const tran1 = await Transaction.create({user1:user1._id,user2:user2._id,emailOne:user1.email,emailTwo:user2.email,amt})

    const updated1 = Number(user1.balance) - Number(amt)
    user1 = await User.updateOne({_id:id},{balance:updated1})
    const updated2 = Number(user2.balance) + Number(amt)
    user2 = await User.updateOne({email:transferTo},{balance:updated2})

    return res.status(StatusCodes.OK).json({success:'Amount Transferred'})
}

// getting all the transactions for an user
const allTransac = async(req,res)=>{
    const {id} = req.user
    if(!id ){
        return res.status(StatusCodes.UNAUTHORIZED).json({msg:'Please provide the valid credentials'})
    }
    const user = await User.findOne({_id:id})
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:'No user with the provided id and account number'})
    }
    const alltra = await Transaction.find({user1:user.id})
    return res.status(StatusCodes.OK).json({transactions:alltra})
}

module.exports = {createUser , checkBal , transaction , allTransac , getInfo}