const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../schema/user');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, email } = req.body;

    try {
        // Check if a user with the provided email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const token = jwt.sign(
                { _id: existingUser._id, isAdmin: existingUser.isAdmin , email : existingUser.email },
                process.env.SECRET_TOKEN
              );
            res.header("x-auth-token").json({ token });
            return 
        }

        // Create new user
        const newUser = new User({ name, email });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { _id: newUser._id, isAdmin: newUser.isAdmin , email : newUser.email },
            process.env.SECRET_TOKEN
          );
        res.header("x-auth-token").json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
