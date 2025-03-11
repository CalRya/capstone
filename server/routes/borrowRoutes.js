const express = require("express");
const router = express.Router();
const { checkOverdueBooks } = require("../utils/sendEmail");
const Borrow = require("../models/Borrow"); // ✅ Import Borrow model

// 📢 Notify Overdue Books
router.get("/overdue/notify", async (req, res) => {
    try {
        console.log("📢 Received request to send overdue notifications...");

        const result = await checkOverdueBooks();
        console.log("✅ Overdue check result:", result);

        res.status(200).json(result);
    } catch (error) {
        console.error("❌ Error sending overdue notifications:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 📌 Get Active Borrow Count
router.get("/count/:userId", async (req, res) => {
    console.log("📌 Received request for active borrow count");
    console.log("🆔 User ID:", req.params.userId);

    try {
        const { userId } = req.params;

        // ✅ Fetch Active Borrows Directly
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
