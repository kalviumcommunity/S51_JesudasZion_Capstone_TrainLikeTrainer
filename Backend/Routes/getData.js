const express = require('express');
const router = express.Router();
const Sport = require('../schema/sports'); 

router.get('/sports/:name', async (req, res) => {
    const sportName = req.params.name;

    try {
        const sport = await Sport.findOne({ name: sportName });

        if (!sport) {
            return res.status(404).json({ message: "Sport not found" });
        }

        res.json(sport);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
