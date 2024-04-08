const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Login = require('../schema/loginSchema');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, password} = req.body;

    try {

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Login({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ email }, process.env.SECRET_TOKEN);

        // Encrypt the token
        const secretKey = process.env.SECRET_TOKEN; // It's advisable to load this from an environment variable
        const cipher = crypto.createCipher('aes-256-cbc', secretKey);
        let encryptedToken = cipher.update(token, 'utf-8', 'hex');
        encryptedToken += cipher.final('hex');

        res.json({ encryptedToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
