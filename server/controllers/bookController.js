// controllers/BookController.js
const Book = require('../models/Book.model');

// Function to add a book
const addBook = async (req, res) => {
  try {
    const { title, author, genre, availableCopies, publicationDate } = req.body;

    // Create a new book document
    const newBook = new Book({
      title,
      author,
      genre,
      availableCopies,
      publicationDate,
    });

    // Save the book to the database
    await newBook.save();

    res.status(201).json({
      success: true,
      message: 'Book added successfully!',
      data: newBook,
    });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ success: false, message: 'Failed to add book', error });
  }
};

module.exports = { addBook };
