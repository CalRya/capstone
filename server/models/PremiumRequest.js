const mongoose = require("mongoose");

const PremiumRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    requestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PremiumRequest", PremiumRequestSchema);
