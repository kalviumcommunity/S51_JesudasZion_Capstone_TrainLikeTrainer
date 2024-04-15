const express = require('express');
const jwt = require('jsonwebtoken');
const Login = require('../schema/loginSchema');

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
        const code_jwt = jwt.sign({code : code}, process.env.OTP_TOKEN, {algorithm : 'HS256'})
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'jesudaszion203@gmail.com',
            pass: 'zltpajnngrpxjlbf'
          }
        });
        
        var mailOptions = {
          from: 'jesudaszion203@gmail.com',
          to: email,
          subject: 'Email Verification Form Train like Trainer',
          text: code
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      
        res.json({message : 'Mail Send' , code : code_jwt})

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


  
  function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }


module.exports = router;
