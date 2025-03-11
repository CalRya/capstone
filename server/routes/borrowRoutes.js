const express = require("express");
const router = express.Router();
const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const nodemailer = require("nodemailer"); // ✅ Import Nodemailer

const authenticateUser = require("../middleware/authMiddleware"); // ✅ Import authentication middleware

router.get("/:userId", authenticateUser, async (req, res) => {
    try {
        const { userId } = req.params;

        // ✅ Prevent users from accessing other users' data
        if (userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const borrowRequests = await Borrow.find({ user: userId }).populate("book");
        res.json(borrowRequests);
    } catch (error) {
        console.error("❌ Error fetching borrow requests:", error);
        res.status(500).json({ message: "Error fetching borrow requests" });
    }
});

// Borrow a book
router.post("/:bookID", async (req, res) => {
    try {
        const { userId } = req.body;
        const { bookID } = req.params;

        const book = await Book.findById(bookID);
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (!book.bookAvailability) {
            return res.status(400).json({ message: "Book is already borrowed" });
        }

        const newBorrow = new Borrow({
            user: userId, // Fixed: changed `user` to `userId`
            book: bookID,
            status: "pending",
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // Due in 3 days
        });

        await newBorrow.save();
        book.bookAvailability = false;
        await book.save();

        res.status(201).json({ message: "Borrow request submitted successfully" });
    } catch (error) {
        console.error("❌ Error borrowing book:", error);
        res.status(500).json({ message: "Error borrowing book" });
    }
});

// Approve a borrow request
router.put("/approve/:borrowId", async (req, res) => {
    try {
        const { borrowId } = req.params;
        
        // Find the borrow request and populate book details
        const borrowRequest = await Borrow.findById(borrowId).populate("book");

        if (!borrowRequest) {
            return res.status(404).json({ message: "Borrow request not found" });
        }

        // Check if the book exists
        if (!borrowRequest.book) {
            return res.status(404).json({ message: "Associated book not found" });
        }

        // Approve the request
        borrowRequest.status = "approved";
        borrowRequest.borrowDate = new Date();
        borrowRequest.dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); 

        // Save updated borrow request
        await borrowRequest.save();

        // Mark the book as unavailable
        await Book.findByIdAndUpdate(borrowRequest.book._id, { bookAvailability: false });

        res.status(200).json({ message: "Book borrow approved!", borrow: borrowRequest });
    } catch (error) {
        console.error("❌ Error approving borrow request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



// Deny a borrow request
router.put("/deny/:borrowId", async (req, res) => {
    try {
        const { borrowId } = req.params;
        const borrowRequest = await Borrow.findById(borrowId);

        if (!borrowRequest) return res.status(404).json({ message: "Borrow request not found" });

        borrowRequest.status = "denied";
        await borrowRequest.save();

        res.json({ message: "Borrow request denied successfully!" });
    } catch (error) {
        console.error("❌ Error denying borrow request:", error);
        res.status(500).json({ message: "Error denying borrow request" });
    }
});
router.put("/rate/:borrowId", async (req, res) => {
    try {
      const { borrowId } = req.params;
      const { rating } = req.body;
  
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Invalid rating. Must be between 1 and 5." });
      }
  
      const borrowEntry = await Borrow.findById(borrowId);
      if (!borrowEntry) {
        return res.status(404).json({ error: "Borrow entry not found." });
      }
  
      if (borrowEntry.status !== "returned") {
        return res.status(400).json({ error: "You can only rate books after returning them." });
      }
  
      borrowEntry.rating = rating;
      await borrowEntry.save();
  
      res.json({ message: "Rating submitted successfully!", borrowEntry });
    } catch (error) {
      console.error("Error updating rating:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// Return a book
router.put("/return/:borrowId", async (req, res) => {
    try {
        const { borrowId } = req.params;
        console.log(`📌 Return Request Received for Borrow ID: ${borrowId}`);

        const borrowRequest = await Borrow.findById(borrowId);
        if (!borrowRequest) {
            console.log(`❌ Borrow request not found for ID: ${borrowId}`);
            return res.status(404).json({ message: "Borrow request not found" });
        }

        console.log(`✅ Borrow request found:`, borrowRequest);

        // Update the borrow request status
        borrowRequest.status = "returned";
        await borrowRequest.save();
        console.log(`✅ Borrow request status updated to "returned"`);

        // Find the associated book
        const book = await Book.findById(borrowRequest.book);
        if (!book) {
            console.log(`❌ Book not found for Borrow ID: ${borrowId}`);
            return res.status(404).json({ message: "Book not found" });
        }

        book.bookAvailability = true;
        await book.save();
        console.log(`✅ Book ${book.bookTitle} is now available for borrowing`);

        res.json({ message: "Book returned successfully!" });
    } catch (error) {
        console.error("❌ Error returning book:", error);
        res.status(500).json({ message: "Error returning book" });
    }
});

// Get all borrow requests
router.get("/", async (req, res) => {
    try {
        const borrowRequests = await Borrow.find()
            .populate("book")
            .populate("user");

        res.json(borrowRequests);
    } catch (error) {
        console.error("❌ Error fetching borrow requests:", error);
        res.status(500).json({ message: "Error fetching borrow requests" });
    }
});



// ✅ Route to Check and Notify Overdue Books
router.get("/overdue/notify", async (req, res) => {
    try {
        const today = new Date();

        // ✅ Find overdue borrow records
        const overdueBorrows = await Borrow.find({
            status: "overdue",
            notified: false // Ensure we only notify once
        }).populate("user", "email name")
          .populate("book", "bookTitle");

        if (overdueBorrows.length === 0) {
            return res.json({ message: "No overdue books found" });
        }

        console.log(`📌 Found ${overdueBorrows.length} overdue books`);

        // ✅ Setup Email Transporter (Replace with your actual email settings)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "lindsaysalvacion110@gmail.com",  // Replace with your email
                pass: "jbib imfx asbw ktma"   // Replace with your email password
            }
        });

        // ✅ Send Email for Each Overdue Borrow
        for (const borrow of overdueBorrows) {
            const mailOptions = {
                from: "lindsaysalvacion110@gmail.com",
                to: borrow.user.email,
                subject: "📢 Overdue Book Notice",
                text: `Dear Reader,\n\nYou have an overdue book: "${borrow.book.bookTitle}". Please return it as soon as possible.\n\nThank you.`
            };

            // ✅ Send email
            await transporter.sendMail(mailOptions);
            console.log(`📩 Email sent to ${borrow.user.email}`);

            // ✅ Update notified status
            borrow.notified = true;
            await borrow.save();
        }

        res.json({ message: "Checked and notified overdue books" });
    } catch (error) {
        console.error("❌ Error checking overdue books:", error);
        res.status(500).json({ error: "Error checking overdue books" });
    }
});




module.exports = router;
