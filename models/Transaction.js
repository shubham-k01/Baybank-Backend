const mongoose = require('mongoose')
const User = require('./User')

const tranSchema = mongoose.Schema({
    user1:{
        type:mongoose.Types.ObjectId,
        required:[true,`Please provide the first user's account number`]
    },
    user2:{
        type:mongoose.Types.ObjectId,
        required:[true,`Please provide the second user's account number`]
    },
    emailOne:{
        type:String,
        required:true
    },
    emailTwo:{
        type:String,
        required:true
    },
    amt:{
        type:Number,
        default:0,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
    
})

module.exports = new mongoose.model('Transaction',tranSchema)