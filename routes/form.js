const { Router } = require("express");
const { Form } = require("../models/formSchema");
const { User } = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');


const formRouter = Router();
const { json } = require("express"); 
formRouter.use(json());


formRouter.post('/formsubmit', async (req,res)=>{
    const {textContent, contentType, userId} = req.body;
    let user = null;
    let formInsert = null;
    try {
        
        user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "NOUSER" });
        }
        const id = uniqid(); 
        formInsert = new Form({ 
            firstName: user.firstName,
            lastName: user.lastName,
            content: textContent,
            feedbackType: contentType,
            userId,
            feedbackId: id
        });
        await formInsert.save();
        res.status(201).json({ feedbackId: id , firstName: user.firstName, lastName: user.lastName});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
   
});

formRouter.get('/getsubmission', async (req, res) => {
    const userId = req.query.userId;
    
   
    
    try {
        const allfeedbacks = await Form.find({ userId });

        if (allfeedbacks.length > 0) {
            
            res.status(200).json({
                data: allfeedbacks
            });
            
        } else {
            res.status(404).json({
                status: "NotFound"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Internal server error"
        });
    }
});


formRouter.get('/allfeedbacks', async (req, res) => {
    const hashedAdminId = req.query.hashedAdminId;
    const userId = req.query.userId;

    //console.log(hashedAdminId, "-------", userId);

    try {
        const isPresent = await User.findById(userId);
      

        if (!isPresent) {
            return res.status(404).json({
                status: "USER_NOT_FOUND"
            });
        }

        const passwordMatch = await bcrypt.compare(isPresent.adminId, hashedAdminId);
       

        if (passwordMatch) {
           
            const allForms = await Form.find();
             console.log(allForms)
            res.status(200).json({
                data: allForms
            });
        } else {
            res.status(404).json({
                status: "INVALID_ADMIN_ID_ASSOCIATED"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "INTERNAL_SERVER_ERROR"
        });
    }
});


module.exports = {
    formRouter
};
