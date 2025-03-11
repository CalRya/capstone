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

const calculateAverageRating = (ratings) => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return (sum / ratings.length).toFixed(1);
};

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

router.post("/books/:id/rate", async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Invalid rating. Must be 1-5." });
        }

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        // ✅ Check if user already rated & update
        const existingRating = book.ratings.find(r => r.user.toString() === userId);
        if (existingRating) {
            existingRating.rating = rating;
        } else {
            book.ratings.push({ user: userId, rating });
        }

        // ✅ Recalculate average rating
        const totalRatings = book.ratings.length;
        const totalScore = book.ratings.reduce((acc, r) => acc + r.rating, 0);
        book.averageRating = totalScore / totalRatings;

        await book.save();
        res.json({ message: "Rating updated", averageRating: book.averageRating });

    } catch (error) {
        console.error("❌ Error updating rating:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/rate/:bookId", async (req, res) => {
    try {
        const { bookId } = req.params;
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        book.ratings.push(rating);
        book.averageRating = calculateAverageRating(book.ratings);
        await book.save();

        res.status(200).json({ message: "Rating added!", averageRating: book.averageRating });
    } catch (error) {
        console.error("Error adding rating:", error);
        res.status(500).json({ message: "Server error" });
    }
});




// Serve uploaded images as static files
router.use('/uploads', express.static('uploads'));

module.exports = router;
