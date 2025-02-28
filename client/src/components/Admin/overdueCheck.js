const Borrow = require("../models/Borrow");

async function checkOverdueBooks() {
  const today = new Date();
  const overdueBooks = await Borrow.find({ returned: false, dueDate: { $lt: today } }).populate("user book");

  overdueBooks.forEach(async (borrow) => {
    console.log(`⚠️ Overdue: ${borrow.book.title} (User: ${borrow.user.email})`);
    // Send email notification (add email service)
  });
}

module.exports = checkOverdueBooks;
