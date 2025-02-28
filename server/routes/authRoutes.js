const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import your User model
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { user, password, role } = req.body;

        // Default role if not provided
        const assignedRole = role || 'user';  

        // Check if user exists
        const existingUser = await User.findOne({ user });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({ user, password: hashedPwd, roles: [assignedRole] }); 
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { user, password } = req.body;

        // Find user
        const foundUser = await User.findOne({ user });
        if (!foundUser) return res.status(400).json({ message: "Invalid credentials" });

        // Compare passwords
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ user, roles: foundUser.roles }, 'your_secret_key', { expiresIn: '1h' });

        res.status(200).json({
            message: "Login successful",
            token,
            roles: foundUser.roles
        });

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


module.exports = router;
