const mongoose = require('mongoose');
const { Schema } = mongoose; // Correct way to get Schema

const UserSchema = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'courier', 'librarian', 'admin'], default: 'student' } // Default role is 'student'
});

module.exports = mongoose.model("User", UserSchema);

