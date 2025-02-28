const cron = require("node-cron");
const Borrow = require("./models/Borrow");
const User = require("./models/User"); // Assuming you have a User model
const sendEmail = require("./utils/sendEmail"); // Function to send emails

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
    console.log("🔍 Checking for overdue books...");
    
    const today = new Date();
    
    try {
        const overdueBorrows = await Borrow.find({
            dueDate: { $lt: today },
            status: "approved",
            notified: false,
        }).populate("user", "name email") // ✅ Get user email
          .populate("book", "bookTitle");

        if (overdueBorrows.length === 0) {
            console.log("✅ No overdue books.");
            return;
        }

        for (const borrow of overdueBorrows) {
            const { user, book } = borrow;

            if (!user.email) {
                console.warn(`⚠️ User ${user.name} has no email on file. Skipping notification.`);
                continue; // ❌ Skip users with no email
            }

            console.log(`🚨 Sending overdue notice for ${borrow.book.bookTitle} to ${user.email}`);

            const sendEmail = require("./utils/sendEmail"); // Ensure correct path

            await sendEmail(user.email, `📢 Overdue Book Notice: ${borrow.book.bookTitle}`, 
                `Dear Reader,\n\nYour borrowed book "${borrow.book.bookTitle}" was due on ${borrow.dueDate.toDateString()}.\n\nPlease return it as soon as possible to avoid penalties.`);
            
            

            borrow.notified = true; // ✅ Mark as notified
            await borrow.save();
        }

        console.log(`📩 Sent ${overdueBorrows.length} overdue notifications.`);
    } catch (error) {
        console.error("❌ Error checking overdue books:", error);
    }
});

