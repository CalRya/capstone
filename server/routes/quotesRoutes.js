const express = require('express');
const router = express.Router();
const Quote = require('../models/Quotes');

// ✅ Get a random quote from the database
router.get('/quote', async (req, res) => {
    try {
        const count = await Quote.countDocuments();
        if (count === 0) {
            return res.status(404).json({ error: "No quotes found." });
        }
        const random = Math.floor(Math.random() * count);
        const quote = await Quote.findOne().skip(random);
        res.json(quote);
    } catch (error) {
        console.error("❌ Error fetching quote:", error);
        res.status(500).json({ error: "Failed to fetch quote" });
    }
});

module.exports = router;
