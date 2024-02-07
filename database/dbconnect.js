const {mongoose} = require('mongoose');


async function dbconnect (uri){
    mongoose.connect(uri).then(()=>{
        console.log("Database connected successfully!")
    }).catch((err)=>{
        console.log("An error ocurred while connecting to the database");
    })
}


module.exports = {
    dbconnect
}


