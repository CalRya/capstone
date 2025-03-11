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
const articleRoutes = require("../routes/articleRoutes");
const borrowRoutes = require("../routes/borrowRoutes");
const authenticateUser = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
const Quote = require("../models/Quotes");  // ✅ Use the existing model instead of redefining it
const premiumRoutes = require("../routes/premiumRoutes");

const calculateLateFee = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    const daysLate = Math.max(0, Math.ceil((today - due) / (1000 * 60 * 60 * 24))); // Convert ms to days

    if (daysLate === 0) return 0; // Not late
    return 15 + (daysLate - 1) * 5; // ₱15 once late + ₱5 per extra day
};

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
    .then(async () => {
        console.log("✅ Connected to MongoDB");

        // ✅ Ensure all books have an averageRating field
        await Book.updateMany({}, { $set: { averageRating: 0 } });
        console.log("✅ Initialized averageRating for all books");
    })
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

app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id).select("user email role premium");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
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

app.put("/api/borrow/approve/:borrowId", async (req, res) => {
    try {
        const { borrowId } = req.params;

        const borrowEntry = await Borrow.findById(borrowId);
        if (!borrowEntry) {
            return res.status(404).json({ message: "Borrow request not found" });
        }

        if (borrowEntry.status !== "pending") {
            return res.status(400).json({ message: "Request is already processed" });
        }

        borrowEntry.status = "approved";
        await borrowEntry.save();

        res.status(200).json({ message: "Request approved successfully!", borrow: borrowEntry });
    } catch (error) {
        console.error("❌ Error approving borrow request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Return a Borrowed Book
app.put("/api/borrow/return/:borrowId", async (req, res) => {
    try {
        const { borrowId } = req.params;

        // Validate if borrowId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(borrowId)) {
            return res.status(400).json({ message: "Invalid borrow ID format" });
        }

        const borrowEntry = await Borrow.findById(borrowId);
        if (!borrowEntry) {
            return res.status(404).json({ message: "Borrow record not found" });
        }

        const lateFee = calculateLateFee(borrowEntry.dueDate);
        borrowEntry.status = "returned";
        borrowEntry.returnedAt = new Date();
        borrowEntry.lateFee = lateFee;
        await borrowEntry.save();

        await Book.findByIdAndUpdate(borrowEntry.book, { bookAvailability: true, borrowedBy: null });

        res.status(200).json({ message: "Book returned successfully!", returnDate: new Date(), lateFee });
    } catch (error) {
        console.error("❌ Error returning book:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find(); // Assuming you're using MongoDB
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

app.get("/api/books/random", async (req, res) => {
    try {
        const books = await Book.aggregate([{ $sample: { size: 8 } }]); // Get 8 random books
        res.json(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: "Failed to fetch books" });
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
            averageRating: 0,
        });

        console.log("✅ Final book object before saving:", newBook);

        await newBook.save();
        res.status(201).json({ message: "✅ Book added successfully!", book: newBook });

    } catch (error) {
        console.error("❌ Error adding book:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.patch("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["admin", "librarian", "student", "courier"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Role updated successfully", user });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Server error" });
    }
});

  
// Example Express.js route handler
app.put('/api/books/:id', upload.single('bookCover'), async (req, res) => {
    const { bookTitle, bookAuthor, bookDescription, bookGenre, bookPlatform, bookAvailability } = req.body;
    const bookCover = req.file; // Handle file separately

    // Convert bookAvailability to a boolean value
    const availability = bookAvailability === 'true' ? true : false;

    try {
      // Update the book with new data, including the file if present
      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        {
          bookTitle,
          bookAuthor,
          bookDescription,
          bookGenre,
          bookPlatform,
          bookAvailability: availability, // Ensure it's a boolean
          bookCoverUrl: bookCover ? `/uploads/${bookCover.filename}` : undefined, // Handle book cover if present
        },
        { new: true }
      );

      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json(updatedBook); // Return updated book info
    } catch (error) {
      console.error("❌ Error updating book:", error);
      res.status(500).json({ message: "Failed to update book" });
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
  

// ✅ Update user by ID (PUT)
app.put("/api/users/:id", async (req, res) => {
    try {
        console.log("Updating user with ID:", req.params.id);
        console.log("Request body:", req.body);

        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedUser) {
            console.error("❌ User not found!");
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("❌ Error updating user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.get("/api/users/:userId", async (req, res) => {
    try {
        const user = await userModel.findById(req.params.userId).lean(); // ✅ Return plain JSON
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Ensure premium status is always included
        res.json({
            _id: user._id,
            user: user.user,
            email: user.email,
            role: user.role,
            premium: user.premium || { status: "basic" } // Default to "basic" if missing
        });
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

  // ✅ Get User Profile by ID
  app.get("/api/users/:id", async (req, res) => {
    try {
        let id = req.params.id.trim();
        console.log("📢 Fetching user with ID:", `"${id}"`);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("❌ Invalid ObjectId format");
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const user = await userModel.findById(id);


        if (!user) {
            console.log("❌ User not found in database");
            return res.status(404).json({ error: "User not found" });
        }

        console.log("✅ User found:", user);
        res.json(user);
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

const saltRounds = 10;

// Assuming you are using Express
app.post('/api/users', async (req, res) => {
    try {
        const { user, email, password, role } = req.body;

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Now save the user with the hashed password
        const newUser = new userModel({ user, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE route to handle deleting a user by ID
// DELETE route to handle deleting a user by ID
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;  // Grab user ID from URL parameter

    try {
        // Find and delete user by ID
        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/api/stats', async (req, res) => {
  try {
    // Query the total number of users
    const totalUsers = await userModel.countDocuments();

    // Query the total number of books
    const totalBooks = await Book.countDocuments();

    // Query the total number of borrowed books (borrowed but not yet returned)
    const totalBorrowedBooks = await Borrow.countDocuments({ isReturned: false });

    // Query active sessions (you can adjust this to your specific needs, e.g., based on login activity)
    const activeSessions = 20;  // For now, assume 20 active sessions

    // Send the actual data in the response
    res.json({
      totalUsers,
      totalBooks,
      totalBorrowedBooks,
      activeSessions,
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).send('Error fetching stats');
  }
});


// ✅ Rate a Borrowed Book
app.put("/api/rate/:borrowId", async (req, res) => {
    console.log("🚀 API HIT: PUT /api/rate/:borrowId");

    try {
        const { rating } = req.body;
        let borrowId = req.params.borrowId.trim();

        console.log("📩 Received Rating Request for Borrow ID:", borrowId, "Rating:", rating);  // Log rating and borrowId

        if (!rating || rating < 1 || rating > 5) {
            console.log("❌ Invalid rating received");
            return res.status(400).json({ message: "Invalid rating. Must be between 1 and 5." });
        }

        // ✅ Find the borrow record
        const borrow = await Borrow.findById(borrowId);
        if (!borrow) {
            console.log("❌ Borrow record not found");
            return res.status(404).json({ message: "Borrow record not found" });
        }

        console.log("✅ Found Borrow Record:", borrow);

        // ✅ Find the book associated with the borrow record
        const book = await Book.findById(borrow.book);
        if (!book) {
            console.log("❌ Book record not found");
            return res.status(404).json({ message: "Book record not found" });
        }

        console.log("✅ Found Book Record:", book);

        // ✅ Check if the user already rated this book
        const userRating = book.ratings.find((r) => r.user.toString() === borrow.user.toString());
        if (userRating) {
            console.log("❌ User has already rated this book");
            return res.status(400).json({ message: "You have already rated this book." });
        }

        // ✅ Add the rating to the book's ratings array
        book.ratings.push({ user: borrow.user, rating });
        await book.save();
        console.log("✅ Rating saved in Book collection");

        // ✅ Calculate the new average rating
        const totalRatings = book.ratings.length;
        const sumRatings = book.ratings.reduce((sum, r) => sum + r.rating, 0);
        const newAverage = totalRatings > 0 ? parseFloat((sumRatings / totalRatings).toFixed(1)) : 0;

        console.log("⭐ New Average Rating Calculated:", newAverage);

        // ✅ Update the average rating in the Book collection
        book.averageRating = newAverage;
        await book.save();
        console.log("✅ Book updated successfully with new average rating:", book);

        res.status(200).json({ message: "Rating submitted successfully!", averageRating: newAverage });

    } catch (error) {
        console.error("❌ Error submitting rating:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//MINIGAME ONE
app.put('/quote/:id', async (req, res) => {
    try {
        const { text, author } = req.body; // Get updated data from request body
        const { id } = req.params; // Get the quote ID from URL

        const updatedQuote = await Quote.findByIdAndUpdate(
            id,
            { text, author },
            { new: true, runValidators: true } // Return updated quote & validate changes
        );

        if (!updatedQuote) {
            return res.status(404).json({ error: "Quote not found." });
        }

        res.json({ message: "✅ Quote updated successfully!", quote: updatedQuote });
    } catch (error) {
        console.error("❌ Error updating quote:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Fetch a random quote dynamically
app.get('/quote', async (req, res) => {
    try {
        const quote = await Quote.aggregate([{ $sample: { size: 1 } }]);
        if (!quote.length) {
            return res.status(404).json({ error: "No quotes found." });
        }
        res.json(quote[0]); // Send the quote dynamically
    } catch (error) {
        console.error("Error fetching quote:", error);
        res.status(500).json({ error: "Error fetching quote" });
    }
});
// Purchase Premium Subscription
app.post("/api/buy-premium", async (req, res) => {
    const { userId } = req.body;
    
    console.log("🛒 Premium purchase request for:", userId);

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            console.log("❌ User not found:", userId);
            return res.status(404).json({ message: "User not found" });
        }

        user.premium = { status: "lifetime", expiryDate: null };
        await user.save();

        console.log("✅ Premium activated successfully for:", userId);
        res.status(200).json({ message: "Premium activated!", premium: user.premium });

    } catch (err) {
        console.error("❌ Error processing premium:", err);
        res.status(500).json({ message: "Error processing premium", error: err.message });
    }
});

// Check Premium Status
app.get("/api/check-premium/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ premium: user.premium });
    } catch (err) {
        res.status(500).json({ message: "Error checking premium status" });
    }
});

app.get("/", (req, res) => {
    res.send("📢 Courier Club API is running...");
});

// ✅ Routes
app.use("/api", bookRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/admin", adminRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/api/premium", premiumRoutes);

// ✅ Start Server
app.listen(3004, () => {
    console.log("🚀 Server running on port 3004");
});
