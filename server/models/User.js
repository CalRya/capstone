const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'courier', 'librarian', 'admin'], default: 'student' },
    premium: { 
        status: { type: String, enum: ['none', 'monthly', 'lifetime'], default: 'none' },
        expiryDate: { type: Date, default: null }
    },
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
});


module.exports = mongoose.model("User", UserSchema);
