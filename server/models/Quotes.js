const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
    text: String,
    author: String,
});

// Use existing model if already compiled, otherwise create a new one
const Quote = mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);

module.exports = Quote;
