const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const NoteSchema = new mongoose.Schema({
    userId :{
        type : Number,
        required: true
    },
    password : {
        type : String,
        minlength : 10
    },
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    category : {
        type : String,
        enum :  ["dailyJournal","thought","memory","general","personal"],
        required : true
    },
    createdAt : {
        type : Date,
        required : true
    },
    updatedAt : {
        type : Date,
        required : true
    },
    isPinned :{
        type : Boolean,
        required: true
    },
    isArchived :{
        type : Boolean,
        required: true
    },
    isPersonal : {
        type : Boolean,
        required : true
    }
    
});

NoteSchema.plugin(AutoIncrement,{inc_field : 'notesId' , start_seq : 1});

const Notes = mongoose.model("Notes",NoteSchema);
module.exports = Notes;