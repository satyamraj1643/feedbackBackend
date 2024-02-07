const { Router } = require("express");
const router = Router();
const ids = require('../adminIDs')
const {User} = require('../models/userSchema')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const adminIds = require("../adminIDs");


// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password, role, adminId } = req.body;

        const user = await User.findOne({ email, role });
 
        
        if (!user) {
            return res.status(401).json({ error: "NOT_FOUND" });
        }
 
        
        if (role === 'admin' && adminId !== user.adminId) {
            
            return res.status(401).json({ error: "MISMATCH_ADMINID" });
        }

        else{

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: "INVALID" });
            }
     
           
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
          
    
            const hashedAdminId = await bcrypt.hash(adminId, 10);
            
            res.status(200).json({ token, id: user._id, hashedAdminId, role });

        }

       
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'INTERNAL' });
    }
 });
 







router.post('/signup', async (req, res) => {
   try{
      const {fn,ln,email,password,role,adminId} = req.body;


      const user = await User.findOne({ email });

      if(user){
        res.status(409).json({error: 'ALREADY'})
      }
      else{

      const hashedpassword = await bcrypt.hash(password , 10);
      
      if (role === 'admin' && !adminIds.includes(adminId) ) {
        return res.status(401).json({ error: "MISMATCH_ADMINID" });
     }
     else{

        const newUser = new User({
            firstName:fn,
            lastName:ln,
            email,
            password:hashedpassword,
            role,
            adminId
        });
  
        await newUser.save();
  
        const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET);

        const salt = await bcrypt.genSalt(10);

        const hashedAdminId = await bcrypt.hash(adminId, salt);
  
        res.status(201).json({token : token, id: newUser._id , hashedAdminId});

     }
       

      }
      
      
      
      
   } catch (error){
      console.error(error);
      res.status(500).json({error: "Internal server error"})
   }
   
});





module.exports = {
    router,
};
