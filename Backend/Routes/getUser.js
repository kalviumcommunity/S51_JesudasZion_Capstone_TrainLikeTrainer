const express = require('express');
const router = express.Router();
const { User } = require("../schema/user");


router.get('/user/:email', async (req, res) => {
    const { email } = req.params;
    console.log(email)
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // console.log(user)
      res.json(user);

    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  module.exports = router;