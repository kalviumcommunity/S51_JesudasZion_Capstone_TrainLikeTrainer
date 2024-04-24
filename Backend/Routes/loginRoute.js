const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {User} = require('../schema/user');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ email }, process.env.SECRET_TOKEN);

        // Encrypt the token
        const secretKey = process.env.SECRET_TOKEN; 
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
