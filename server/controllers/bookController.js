const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const User = require("../models/User");

// 📌 Borrow a Book (STRICT Borrow Limit Check)
const borrowBook = async (req, res) => {
    try {
        const { bookID } = req.params;
        const { user } = req.body;

        console.log("📥 Borrow Request Received:", { bookID, user });

        // 🔍 Check if book exists and is available
        const book = await Book.findById(bookID);
        if (!book || !book.bookAvailability) {
            return res.status(400).json({ message: "Book is not available" });
        }

        // 🔍 Get user details
        const userData = await User.findById(user);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🔍 Check active borrows
        const activeBorrows = await Borrow.countDocuments({
            user,
            status: { $in: ["pending", "approved", "overdue"] }
        });

        // ⛔ Enforce strict borrow limit
        const borrowLimit = userData.premium?.status === "lifetime" ? 3 : 1;
        if (activeBorrows >= borrowLimit) {
            return res.status(403).json({
                message: `Borrow limit reached! You can only borrow up to ${borrowLimit} book(s).`
            });
        }

        // 📌 Create borrow request
        const borrow = new Borrow({
            user,
            book: bookID,
            status: "pending",
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
        });

        await borrow.save();
        res.status(201).json({ message: "Borrow request submitted successfully" });

    } catch (error) {
        console.error("❌ Error borrowing book:", error);
        res.status(500).json({ message: "Error borrowing book" });
    }
};

router.put("/borrow/approve/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const borrow = await Borrow.findById(id);
        if (!borrow) {
            return res.status(404).json({ message: "Borrow request not found" });
        }

        borrow.status = "approved";
        await borrow.save();

        res.json({ message: "Request approved successfully", borrow });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


module.exports = { borrowBook };
