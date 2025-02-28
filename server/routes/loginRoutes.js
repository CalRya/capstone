const express = require('express');
const User = require('../models/User'); // Adjust the path based on your structure
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { user, password } = req.body;

    try {
        // Find user in database
        const foundUser = await User.findOne({ username: user });

        if (!foundUser) {
            return res.status(401).json({ error: "User not found" });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, foundUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Check if role is missing
        if (!foundUser.role) {
            return res.status(500).json({ error: "No Role Assigned" });
        }

        // ✅ Return user role along with success message
        res.json({
            message: "Login successful",
            role: foundUser.role
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
