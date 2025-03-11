const nodemailer = require("nodemailer");
const Borrow = require("../models/Borrow");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "lindsaysalvacion110@gmail.com", // Your Gmail address
        pass: "jbib imfx asbw ktma", // 🔥 App Password (NEVER commit this to GitHub!)
    },
    debug: true,
    logger: true,
});

// ✅ Function to Check & Notify Overdue Books
async function checkOverdueBooks() {
    try {
        console.log("🔍 Checking for overdue books...");

        // 🔧 Fix Date Comparison Issue
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Removes time part to avoid timezone issues

        // 🔍 Fetch Overdue Books
        const overdueBooks = await Borrow.find({
            dueDate: { $lt: now }, // ✅ Ensures only past due books
            status: { $in: ["approved", "overdue"] }, // ✅ Consider both statuses
            notified: false,
        })
        .populate("user", "email user")
        .populate("book", "bookTitle");

        console.log("📢 Overdue Books Found:", overdueBooks.length);

        if (overdueBooks.length === 0) {
            return { message: "No overdue books found." };
        }

        for (const borrow of overdueBooks) {
            const { user, book, _id } = borrow;
            console.log(`📢 Sending overdue notice for "${book.bookTitle}" to ${user.email}`);

            const mailOptions = {
                from: "lindsaysalvacion110@gmail.com",
                to: user.email,
                subject: `📢 Overdue Book Notice: ${book.bookTitle}`,
                text: `Hello ${user.user},\n\nYour borrowed book "${book.bookTitle}" was due on ${borrow.dueDate.toDateString()}.\n\nPlease return it as soon as possible to avoid penalties.\n\nThank you!`,
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log(`✅ Overdue email sent to ${user.email}: ${info.response}`);

                await Borrow.findByIdAndUpdate(_id, { notified: true }); // ✅ Mark as notified

            } catch (error) {
                console.error(`❌ Error sending email to ${user.email}:`, error);
            }
        }

        return { message: "Overdue notifications sent successfully!" };
    } catch (error) {
        console.error("❌ Error checking overdue books:", error);
        return { error: "Error checking overdue books." };
    }
}

module.exports = { checkOverdueBooks };
