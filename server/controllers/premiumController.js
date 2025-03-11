const PremiumRequest = require("../models/PremiumRequest");
const User = require("../models/User");

// ✅ User requests premium membership
const requestPremium = async (req, res) => {
    try {
        const { userId } = req.body;

        const existingRequest = await PremiumRequest.findOne({ user: userId, status: "pending" });
        if (existingRequest) {
            return res.status(400).json({ message: "You already have a pending request." });
        }

        const premiumRequest = new PremiumRequest({ user: userId });
        await premiumRequest.save();

        res.status(201).json({ message: "Premium request submitted successfully!" });
    } catch (error) {
        console.error("❌ Error requesting premium:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ Librarian gets all pending requests
const getPremiumRequests = async (req, res) => {
    try {
        const requests = await PremiumRequest.find()
            .populate("user", "username email"); // Ensure we fetch username & email

        res.json(requests);
    } catch (error) {
        console.error("❌ Error fetching premium requests:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ✅ Librarian approves request & updates user to premium
const approvePremiumRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await PremiumRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: "Request not found" });

        request.status = "approved";
        await request.save();

        // ✅ Update user model to be premium
        await User.findByIdAndUpdate(request.user, { isPremium: true });

        res.status(200).json({ message: "Premium request approved successfully!" });
    } catch (error) {
        console.error("❌ Error approving premium request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Check if user is premium
const checkPremiumStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ isPremium: user.isPremium });
    } catch (error) {
        console.error("❌ Error checking premium status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { requestPremium, getPremiumRequests, approvePremiumRequest, checkPremiumStatus };
