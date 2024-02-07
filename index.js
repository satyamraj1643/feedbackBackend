const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const cors = require('cors');

const {router}  = require('./routes/user');

const {formRouter} = require('./routes/form')
const { dbconnect } = require('./database/dbconnect');
const PORT = 5000;
const uri = "mongodb+srv://satyamraj1643:kCUEUS9zYTCHABLC@feedbacksystemcluster.gyshu76.mongodb.net/?retryWrites=true&w=majority";
dbconnect(uri);
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const allowedOrigins = ['https://feedback-gch3.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)!== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.get('/', (req,res)=>{
    res.send("Hello from backend!");
})

app.use('/', router);
app.use('/', formRouter);


app.listen(PORT, ()=>{
    console.log(`App Started on port ${PORT}`)
})

