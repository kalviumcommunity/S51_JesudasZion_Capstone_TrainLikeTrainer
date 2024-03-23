const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Login = require('../schema/loginSchema');

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await Login.findOne({ email });
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
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
