const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Login = require('../schema/loginSchema');
require('dotenv').config()

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, password ,code , verifyCode} = req.body;

    try {
        if (!code) {
            return res.status(400).json({ message: 'OTP are required.' });
          }

          const decoded_token = jwt.decode(verifyCode, process.env.OTP_TOKEN, algorithms=['HS256'])
          if (!code == decoded_token){
            return res.status(400).json({ message: 'Invalid OTP.' });
          }
        

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Login({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ email }, process.env.SECRET_TOKEN);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;