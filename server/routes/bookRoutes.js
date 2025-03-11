const express = require("express");
const router = express.Router();
const Borrow = require("../models/Borrow");
const authenticateUser = require("../middleware/authMiddleware");

// 📌 Get Active Borrow Count (STRICT)
router.get("/count/:userId", authenticateUser, async (req, res) => {
    console.log("📌 Received request for active borrow count");
    console.log("🆔 User ID:", req.params.userId);

    try {
        const { userId } = req.params;

        if (userId !== req.user.id) {
            console.log("❌ Unauthorized access attempt");
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const activeBorrows = await Borrow.countDocuments({
            user: userId,
            status: { $in: ["pending", "approved", "overdue"] }
        });

        console.log("📊 Active Borrows Count:", activeBorrows);
        res.json({ activeBorrows });
    } catch (error) {
        console.error("❌ Error fetching active borrow count:", error);
        res.status(500).json({ message: "Error fetching active borrow count" });
    }
});


module.exports = router;
