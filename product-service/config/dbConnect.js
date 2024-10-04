require('dotenv').config();
const mongoose = require("mongoose");

const connectDB=async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected database successfully")
    }
    catch(error){
        console.log(`error in connecting database \n${error}`);
    }
}

module.exports=connectDB;