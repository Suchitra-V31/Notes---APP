const mongoose = require("mongoose");

const mongoURL = process.env.MONGODB_URL;

const connectDB = async() =>{
    try{
        await mongoose.connect(mongoURL)
        console.log("MONGODB Connected!!!");
    }
    catch(e){
        console.log("Issue with mongodb connection "+ e.message);
        process.exit(1);
    }
}

module.exports = connectDB;