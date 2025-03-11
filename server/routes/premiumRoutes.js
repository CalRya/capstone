const express = require("express");
const { requestPremium, getPremiumRequests, approvePremiumRequest, checkPremiumStatus } = require("../controllers/premiumController");
const router = express.Router();
const PremiumRequest = require("../models/PremiumRequest");

// ✅ User requests premium
router.post("/request-premium", requestPremium);

// ✅ Librarian views all premium requests
router.get("/premium-requests", getPremiumRequests);

// ✅ Librarian approves a request
router.put("/approve-premium/:requestId", approvePremiumRequest);

// ✅ Librarian rejects a request
router.put("/reject-premium/:requestId", async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await PremiumRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: "Request not found" });

        request.status = "rejected";
        await request.save();
        res.status(200).json({ message: "Request rejected successfully" });
    } catch (error) {
        console.error("❌ Error rejecting request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Check if user is premium
router.get("/check-premium/:userId", checkPremiumStatus);

module.exports = router;
