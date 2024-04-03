const express = require('express');
const jwt = require('jsonwebtoken');
const Login = require('../schema/loginSchema');
const nodemailer = require('nodemailer')
require('dotenv').config()

const router = express.Router();


router.post('/', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if email already exists
        const existingUser = await Login.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const code = generateVerificationCode()
        console.log(code)
        sendVerificationEmail(email,code)
        const code_jwt = jwt.sign({code : code}, process.env.OTP_TOKEN, {algorithm : 'HS256'})
        res.json({message : 'Mail Send' , code : code_jwt})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

function sendVerificationEmail(email, code) {
    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port : 465,
      secure : true ,
      auth: {
        user: 'jesudaszion203@gmail.com',
        pass: process.env.PASSWORD,
      },
    });
  
    // Email content
    const mailOptions = {
      from: 'jesudaszion203@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${code}`,
    };
  
    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
  
  function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }


module.exports = router;
