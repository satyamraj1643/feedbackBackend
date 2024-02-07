const { Router } = require("express");
const { Form } = require("../models/formSchema");
const { User } = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid'); // Import uniqid
// const cookieParser = require('cookie-parser');

const formRouter = Router();
const { json } = require("express"); 
formRouter.use(json());
// formRouter.use(cookieParser());


formRouter.post('/formsubmit', async (req,res)=>{
    const {textContent, contentType, userId} = req.body;
    let user = null;
    let formInsert = null;
    try {
        // Corrected await usage and passing userId variable
        user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "NOUSER" });
        }
        const id = uniqid(); // Generate unique ID
        formInsert = new Form({ // Corrected model name to Form
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
    //console.log(textContent, contentType, userId);
});

formRouter.get('/getsubmission', async (req, res) => {
    const userId = req.query.userId;
    
    //console.log("User id is", userId);
    
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

    console.log(hashedAdminId, "-------", userId);

    try {
        const isPresent = await User.findById(userId);
        //console.log(isPresent);

        if (!isPresent) {
            return res.status(404).json({
                status: "USER_NOT_FOUND"
            });
        }

        const passwordMatch = await bcrypt.compare(isPresent.adminId, hashedAdminId);
        //console.log("passwordMatch:", passwordMatch);

        if (passwordMatch) {
            // console.log("hello");
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
