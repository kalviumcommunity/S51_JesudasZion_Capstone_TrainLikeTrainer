const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {User} = require('../schema/user');
const validateUser = require('../dataValidator'); 
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {

    const { name, email, password} = req.body;
   

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            { _id: newUser._id, isAdmin: newUser.isAdmin , email : newUser.email , },
            process.env.SECRET_TOKEN
          );
          res
            .header("x-auth-token", token)
            .header("access-control-expose-headers", "x-auth-token")
            .json({token})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
