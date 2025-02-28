const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Book = require('../models/Book'); // Ensure the correct path

// Set up storage engine for Multer
const storage = multer.diskStorage({
    destination: './uploads/', // Save images in "uploads" folder
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// 📌 Fetch all books
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books" });
    }
});

// 📌 Add a new book (with image upload)
router.post("/borrow/:bookId", async (req, res) => {
    try {
        const { bookID } = req.params;
        const { user } = req.body; // Get user ID from request body

        if (!bookID || !user) {
            return res.status(400).json({ message: "Missing book ID or user ID" });
        }

        const book = await Book.findById(bookID);
        if (!book || !book.Availability) {
            return res.status(400).json({ message: "Book not available" });
        }

        // Set due date (14 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        // Mark book as borrowed
        book.bookAvailability = false;
        book.borrowedBy = user;
        book.dueDate = dueDate;
        await book.save();

        // Save borrow record
        const borrow = new Borrow({ user: user, book: bookId, due: dueDate });
        await borrow.save();

        res.json({ message: "Book borrowed successfully", borrow });
    } catch (error) {
        console.error("Error borrowing book:", error);
        res.status(500).json({ message: "Error borrowing book", error });
    }
});


// Serve uploaded images as static files
router.use('/uploads', express.static('uploads'));

module.exports = router;
