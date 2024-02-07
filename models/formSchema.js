const mongoose = require('mongoose')

const {Schema, model}= mongoose;

const formSchema = new Schema({
    firstName:{
        type: String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    feedbackType:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true,
    },
    feedbackId:{
        type:String,
        required:true,
    }
},{timestamps:true})

const Form = model("form", formSchema);


module.exports={
    Form
}