const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const UsersSchema = new mongoose.Schema({
    username : {
        type:String,
        required: true
    },
    email : {
        type : String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email format']
    },
    password : {
        type : String,
        required : true,
        minlength : 8
    },
    loginAttempt :{
        type: Number,
        default : 0
    }

});

UsersSchema.plugin(AutoIncrement, { inc_field: 'userId', start_seq: 1 });

const Users = mongoose.model("Users",UsersSchema);
module.exports = Users;

