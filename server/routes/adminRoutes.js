const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import user model
const bcrypt = require('bcryptjs');


// Middleware to check if user is an admin
const isAdmin = async (req, res, next) => {
    try {
        const adminId = req.headers.adminid;  // 🔹 Read adminId from headers
        const user = await User.findById(adminId);

        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: "Unauthorized: Admin access only" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};


// Get all users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});


// Update user role
router.put('/users/:id', isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user role" });
    }
});

// Delete a user
router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// Approve a borrow request
router.post("/borrow/approve/:borrowId", async (req, res) => {
    try {
      const { borrowId } = req.params;
      const { adminId } = req.body;  // Make sure adminId is sent
  
      // Validate that the admin exists and is an admin
      const User = require("../models/User");
      const admin = await User.findById(adminId);
      if (!admin || admin.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access only" });
      }
  
      const borrowRequest = await Borrow.findById(borrowId);
      if (!borrowRequest) {
        return res.status(404).json({ message: "Borrow request not found" });
      }
      if (borrowRequest.status !== "pending") {
        return res.status(400).json({ message: "Borrow request already processed" });
      }
  
      // Approve the request: set status to approved, set start and due date (e.g., due in 3 days)
      borrowRequest.status = "approved";
      borrowRequest.start = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3); // Due in 3 days
      borrowRequest.due = dueDate;
      await borrowRequest.save();
  
      // Update the book's availability
      const book = await Book.findById(borrowRequest.book);
      book.availability = false;
      book.borrowedBy = borrowRequest.user;
      book.dueDate = dueDate;
      await book.save();
  
      res.json({ message: "Borrow request approved", borrow: borrowRequest });
    } catch (error) {
      console.error("Error approving borrow request:", error);
      res.status(500).json({ message: "Error approving borrow request", error });
    }
  });
// Reject a borrow request
router.post("/borrow/reject/:borrowId", async (req, res) => {
    try {
      const { borrowId } = req.params;
      const { adminId } = req.body;
  
      // Validate admin
      const User = require("../models/User");
      const admin = await User.findById(adminId);
      if (!admin || admin.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized: Admin access only" });
      }
  
      const borrowRequest = await Borrow.findById(borrowId);
      if (!borrowRequest) {
        return res.status(404).json({ message: "Borrow request not found" });
      }
      if (borrowRequest.status !== "pending") {
        return res.status(400).json({ message: "Borrow request already processed" });
      }
  
      // Reject the request: set status to rejected
      borrowRequest.status = "rejected";
      await borrowRequest.save();
  
      res.json({ message: "Borrow request rejected", borrow: borrowRequest });
    } catch (error) {
      console.error("Error rejecting borrow request:", error);
      res.status(500).json({ message: "Error rejecting borrow request", error });
    }
  });
    

module.exports = router;
