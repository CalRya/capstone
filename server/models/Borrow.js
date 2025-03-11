const mongoose = require("mongoose");

const BorrowSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    bookTitle: {  // ✅ Storing bookTitle separately
        type: String,
        required: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    borrowDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "returned", "overdue", "denied"],
        default: "pending",
    },
    notified: { 
        type: Boolean, 
        default: false },
        
    rating: { 
        type: Number, min: 1, max: 5 } // ⭐ New field for storing ratings
    });


module.exports = mongoose.model("Borrow", BorrowSchema);
