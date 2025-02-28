const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const userModel = require("../models/User");
const bookRoutes = require("../routes/bookRoutes");
const adminRoutes = require("../routes/adminRoutes");
const Book = require("../models/Book");
const Borrow = require("../models/Borrow");
const borrowRoutes = require("../routes/borrowRoutes");
const authenticateUser = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");


const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Replace with frontend URL

// ✅ Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// ✅ Serve uploaded images as static files
app.use("/uploads", express.static(uploadDir));

app.options("*", (req, res) => {
    console.log("Pre-flight request received");
    res.sendStatus(200);
});

// ✅ MongoDB Connection
mongoose.connect("mongodb://localhost:27017/CAPSTONE")
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ User Registration
app.post("/register", async (req, res) => {
    try {
        const { user, email, password } = req.body;

        if (!user || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ user, email, password: hashedPassword });

        res.status(201).json({ message: "User registered successfully", email: newUser.email });

    } catch (err) {
        console.error("❌ Error inserting user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ User Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await userModel.findOne({ email });

        if (!foundUser) {
            return res.status(401).json({ error: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, foundUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({
            message: "✅ Login successful",
            id: foundUser._id,
            email: foundUser.email,
            role: foundUser.role
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Get Borrowed Books by User
app.get("/api/borrow/:user", async (req, res) => {
    try {
        const { user } = req.params;
        if (!user) return res.status(400).json({ message: "User ID is required" });

        const borrowedBooks = await Borrow.find({ user: user, status: { $in: ["pending", "approved", "returned"] } })
            .populate("book");

        if (!borrowedBooks.length) {
            return res.status(404).json({ message: "No borrowed books found" });
        }

        res.status(200).json(borrowedBooks);
    } catch (error) {
        console.error("❌ Error fetching borrowed books:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Borrow a Book
app.post("/api/borrow/:bookID", async (req, res) => {
    try {
        const { bookID } = req.params;
        const { user } = req.body;

        if (!bookID || !user) {
            return res.status(400).json({ message: "Missing book ID or user ID" });
        }

        const existingBorrow = await Borrow.findOne({ book: bookID, status: { $in: ["pending", "approved"] } });
        if (existingBorrow) {
            return res.status(400).json({ message: "Book is already borrowed or awaiting approval" });
        }

        const borrowEntry = new Borrow({
            user: user,
            book: bookID,
            status: "pending",
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        });

        console.log("📌 New Borrow Request:", borrowEntry);
        await borrowEntry.save();

        await Book.findByIdAndUpdate(bookID, { bookAvailability: false, borrowedBy: user });

        res.status(201).json({ message: "Borrow request sent!", borrow: borrowEntry });
    } catch (error) {
        console.error("❌ Error in borrowing book:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Return a Borrowed Book
app.post("/api/return/:borrowId", async (req, res) => {
    try {
        const { borrowId } = req.params;

        const borrowEntry = await Borrow.findById(borrowId);
        if (!borrowEntry) return res.status(404).json({ message: "Borrow record not found" });

        borrowEntry.status = "returned";
        borrowEntry.returnedAt = new Date();
        await borrowEntry.save();

        await Book.findByIdAndUpdate(borrowEntry.book, { bookavailability: true, borrowedBy: null });

        res.status(200).json({ message: "Book returned successfully!" });
    } catch (error) {
        console.error("❌ Error returning book:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Get ALL Borrow Requests (for admin)
app.get("/api/borrow", async (req, res) => {
    try {
        const borrowRequests = await Borrow.find({
            status: { $in: ["pending", "approved", "returned", "overdue"] }
        })
        .populate("book")
        .populate("user");

        console.log("📜 Borrow Requests Found:", JSON.stringify(borrowRequests, null, 2));
        res.json(borrowRequests);
    } catch (error) {
        console.error("❌ Error fetching borrow requests:", error);
        res.status(500).json({ error: "Failed to fetch borrow requests" });
    }
});

// ✅ Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// ✅ Add a New Book
app.post("/api/books", upload.single("bookCover"), async (req, res) => {
    try {
        console.log("📥 Received book data:", req.body);

        const { bookID, bookTitle, bookAuthor, bookDescription, bookGenre, bookPlatform, bookAvailability } = req.body;
        const bookCoverUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const isAvailable = bookAvailability === "true";

        console.log("📌 Processed bookAvailability:", isAvailable);

        const newBook = new Book({
            bookID,
            bookTitle,
            bookAuthor,
            bookDescription: bookDescription || "",
            bookGenre: bookGenre || "",
            bookPlatform: bookPlatform || "",
            bookAvailability: isAvailable,
            bookCoverUrl,
        });

        console.log("✅ Final book object before saving:", newBook);

        await newBook.save();
        res.status(201).json({ message: "✅ Book added successfully!", book: newBook });

    } catch (error) {
        console.error("❌ Error adding book:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "lindsaysalvacion110@gmail.com", // Your Gmail address
        pass: "jbib imfx asbw ktma", // Your generated App Password
    },
    debug: true,
    logger: true,
});

// ✅ Function to Check & Notify Overdue Books
async function checkOverdueBooks() {
    try {
        const today = new Date();
        console.log("🔍 Checking for overdue books...");

        // Find books that are overdue and haven't been notified
        const overdueBooks = await Borrow.find({
            dueDate: { $lt: today },
            status: "approved",
            notified: false,
        }).populate("user", "email name")
          .populate("book", "bookTitle");

        if (overdueBooks.length === 0) {
            console.log("✅ No overdue books found.");
            return;
        }

        for (const borrow of overdueBooks) {
            const { user, book, _id } = borrow;
            console.log(`📢 Sending overdue notice for ${borrow.book.bookTitle} to ${user.email}`);

            const mailOptions = {
                from: "lindsaysalvacion110@gmail.com",
                to: user.email,
                subject: `📢 Overdue Book Notice: ${book.bookTitle}`,
                text: `Hello Reader, your borrowed book "${borrow.book.bookTitle}" was due on ${borrow.dueDate.toDateString()}.\n\nPlease return it as soon as possible to avoid penalties.\n\nThank you!`,
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log(`✅ Overdue email sent to ${user.email}`);
            } catch (error) {
                console.error("❌ Error sending overdue email:", error);
            }

            // Update borrow entry to prevent duplicate notifications
            await Borrow.findByIdAndUpdate(_id, { notified: true });
        }
    } catch (error) {
        console.error("❌ Error checking overdue books:", error);
    }
}

// ✅ Schedule Overdue Check Every Hour
setInterval(checkOverdueBooks, 60 * 60 * 1000); // Run every 1 hour

  
app.put("/api/books/:id", async (req, res) => {
    const { id } = req.params;
    const { bookTitle, bookAuthor, bookDescription, bookGenre, bookPlatform, bookAvailability } = req.body;
  
    try {
        const updatedBook = await Book.findByIdAndUpdate(id, {
            bookTitle,
            bookAuthor,
            bookDescription,
            bookGenre,
            bookPlatform,
            bookAvailability: bookAvailability === "true" || bookAvailability === true,
        }, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        console.log("✅ Book updated in database:", updatedBook);
        res.json(updatedBook);
    } catch (error) {
        console.error("❌ Error updating book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

  

  app.delete("/api/books/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedBook = await Book.findByIdAndDelete(id);
      if (!deletedBook) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  
  
// ✅ Routes
app.use("/api", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Start Server
app.listen(3004, () => {
    console.log("🚀 Server running on port 3004");
});
