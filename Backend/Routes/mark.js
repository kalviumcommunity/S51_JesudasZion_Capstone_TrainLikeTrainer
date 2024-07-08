const express = require("express");
const { User } = require("../schema/user");
require("dotenv").config();

const router = express.Router();

router.put("/", async (req, res) => {
  try {
    const { name, _id } = req.body;

    const user = await User.findOne({ _id: _id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const lessonExists = user.lessons.some(lesson => lesson.name === name);
    if (lessonExists) {
      return res.status(400).json({ error: "Lesson with this name already exists" });
    }

    user.lessons.push({
      name: name,
      time: new Date()
    });

    await user.save();

    return res.json({ message: "Success", user });
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
