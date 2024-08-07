const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    var tempOtp = 0
    const { otp,userOtp} = req.body;
    // console.log(otp)
    jwt.verify(otp, process.env.OTP_TOKEN, (err, decoded) => {
        if (err) {
            console.error("JWT verification failed:", err);
            
        } else {
           
            tempOtp = decoded.code
            // console.log("d",decoded.code)
        }
    });

    try {
        // console.log(tempOtp,userOtp)
        // console.log(otp) 
        if (tempOtp !== userOtp) {
            return res.status(400).json({ message: 'Invalid OTP' ,auth : false});
        }else{
            return res.status(201).json({auth : true})
        }


        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
