const express = require('express');

const {User} = require('../schema/user');
const validateUser = require('../dataValidator'); 
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {

    const { email, password } = req.body;

    // Find the user by email
    const user = User.find(user => user.email === email);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Update user's password
    user.password = password;

    return res.json({ message: 'Password updated successfully' });
});

module.exports = router;
