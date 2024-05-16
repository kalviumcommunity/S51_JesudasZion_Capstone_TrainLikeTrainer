const express = require("express");

const { User } = require("../schema/user");
const validateUser = require("../dataValidator");
require("dotenv").config();

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await  User.findOne({email : email});

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user's password
    user.password = password;

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
