const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
   
    password:{
        type: String,
        required:true,
        unique:true,

    },
    
    role:{
     type: String,
     enum:["user", "admin"],
     default : "user",
    },

    adminId:{
        type: String,

    }
}, {timestamps:true});


const User = model("user",userSchema);

module.exports={
    User
}