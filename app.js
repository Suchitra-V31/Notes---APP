require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const connectDB = require("./config/mongodb");


const cors = require('cors');
app.use(cors());

// Connect to mongo db
connectDB();

const homeRoute = require("./routes/routes");

app.use("/",homeRoute);

app.use((req,res,next)=>{
    res.status(400).send(`404 - Page Not Found`);
});

app.use((err,req,res,next)=>{
    console.log(err.message);
    res.status(500).send(`Error : `+ err.message);
})

app.listen(process.env.PORT, ()=>{
    console.log("Server running at http://localhost:3000/");
});