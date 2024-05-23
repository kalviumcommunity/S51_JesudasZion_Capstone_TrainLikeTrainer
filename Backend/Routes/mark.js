const express = require("express");
const { User } = require("../schema/user");
require("dotenv").config();

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { name, _id } = req.body;
    // console.log(req.body);

    // Find the user by _id
    const user = await User.findOne({ _id: _id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add new lesson to user's lessons array
    user.lessons.push({
      name: name,
      time: new Date()
    });

    // Save the updated user document
    await user.save();

    return res.json({ message: "Success", user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
