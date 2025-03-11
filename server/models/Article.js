const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    language: { type: String, enum: ["English", "Tagalog"], required: true },
    writer: { type: String, required: true }, // ✅ Added writer
    illustrator: { type: String, default: "" }, // ✅ Added illustrator
    category: { type: String, required: true }, // ✅ Ensure category is included
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Article", ArticleSchema);
