const User = require("../models/User");
const Notes = require("../models/Notes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {errorResponse} = require("../middleware/middleware");
const TokenBlacklist = require("../models/tokenBlackListing");

const createUser = async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const createUser = await new User({username,email,password:hashedPassword});
        createUser.save();
        res.status(200).json({
            status:"SUCCESS",
            message : "User Created Successfully",
            user : createUser
        })
    }
    catch(e){
        res.status(500).json(errorResponse("createUser",e));
    }

}

const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                status: "FAILURE",
                message : "Invalid email id!!"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({
                status: "FAILURE",
                message : "Invalid password!!!"
            })
        }
        const token = jwt.sign(
            { userId: user.userId, email: user.email },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            user: {
              id: user.userId, 
              name: user.userName,
              email: user.email
            }
          });
          
    }
    catch(e){
        res.status(500).json(errorResponse("loginUser",e));
    }
}

const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000); 

    const blacklistedToken = new TokenBlacklist({ token, expiresAt });
    await blacklistedToken.save();

    res.status(200).json({ message: "Logout successful. Token blacklisted." });
  } catch (e) {
    res.status(500).json(errorResponse("logoutUser", e));
  }
};


const updateUser = async(req,res)=>{
    const userName = req.params.userName;
    try{
        const updateUser = await User.findOneAndUpdate({userName},req.body,{new:true});
        res.status(200).json({
            status : "SUCCESS",
            message : "Username Updated Successfully!!!",
            user : updatedUser
        })
    }
    catch(e){
        res.status(500).json(errorResponse("updateUser",e));
    }
}

const deleteUserById = async (req, res) => {
    const userId = req.params.userId;
    try {
        await Notes.deleteMany({userId : userId});
        await User.findOneAndDelete({ userId : userId });
        res.status(200).json({ message: "User and Notes deleted Successfully!!!" });
    } catch (e) {
        res.status(400).json(errorResponse("deleteUserByName",e));
    }
};

const resetPasswordForUser = async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword) {
      return res.status(400).json({
        status: "FAILURE",
        message: "New password is required."
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedNote = await User.findOneAndUpdate(
      { userId },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        status: "FAILURE",
        message: "User not found!!!."
      });
    }

    res.status(200).json({
      status: "SUCCESS",
      message: "Password reset successfully."
    });

  } catch (e) {
    res.status(500).json(errorResponse("resetPassword", e));
  }
};


module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUserById,
    resetPasswordForUser
};