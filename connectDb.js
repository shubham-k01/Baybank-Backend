const mongoose = require('mongoose')

const connection =  async(url)=>{
    // First approach to connect to the database directly by specifying the URI in this file
    // await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.0eowvto.mongodb.net/?retryWrites=true&w=majority`,(err)=>{
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         console.log('Connection successful');
    //     }
    // })
    await mongoose.connect(url,(err)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log('Connection successful');
        }
    })
}

module.exports = connection




