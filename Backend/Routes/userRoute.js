const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../schema/user');
const validateUser = require('../dataValidator'); 
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    // Validate the user input
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User with this email already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { _id: newUser._id, isAdmin: newUser.isAdmin, email: newUser.email, profilePhoto: newUser.profilePhoto, description: newUser.description },
            process.env.SECRET_TOKEN
        );

        // Respond with token
        res
            .header("x-auth-token", token)
            .header("access-control-expose-headers", "x-auth-token")
            .json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
