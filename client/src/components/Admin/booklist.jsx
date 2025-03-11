import React, { useState } from "react";
import "../CSS FOLDER/booklist.css";

const AddBook = ({ onBookAdded }) => {
  const [book, setBook] = useState({
    bookID: "",
    bookTitle: "",
    bookAuthor: "",
    bookDescription: "",
    bookGenre: "",
    bookPlatform: "Physical",
    bookAvailability: true, // ✅ Boolean value
    bookCover: null,
  });

  // Handle input changes (text, select, checkbox)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setBook((prevBook) => ({
      ...prevBook,
      bookCover: e.target.files[0],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("bookID", book.bookID);
    formData.append("bookTitle", book.bookTitle);
    formData.append("bookAuthor", book.bookAuthor);
    formData.append("bookDescription", book.bookDescription);
    formData.append("bookGenre", book.bookGenre);
    formData.append("bookPlatform", book.bookPlatform);
    formData.append("bookAvailability", book.bookAvailability ? "true" : "false"); // ✅ Convert to string for backend

    if (book.bookCover) {
      formData.append("bookCover", book.bookCover);
    }

    console.log("📤 Sending data:", Object.fromEntries(formData)); // ✅ Debug log

    try {
      const response = await fetch("http://localhost:3004/api/books", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const newBook = await response.json();
      console.log("✅ Book added successfully:", newBook);

      if (typeof onBookAdded === "function") {
        onBookAdded(); // Refresh book list
      }

      // Reset form
      setBook({
        bookID: "",
        bookTitle: "",
        bookAuthor: "",
        bookDescription: "",
        bookGenre: "",
        bookPlatform: "Physical",
        bookAvailability: true, // ✅ Reset to default available
        bookCover: null,
      });
    } catch (error) {
      console.error("❌ Failed to add book:", error);
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="add-book-form">
        <input type="text" name="bookID" value={book.bookID} onChange={handleChange} placeholder="Book ID" required />
        <input type="text" name="bookTitle" value={book.bookTitle} onChange={handleChange} placeholder="Book Title" required />
        <input type="text" name="bookAuthor" value={book.bookAuthor} onChange={handleChange} placeholder="Author" required />
        
        {/* Updated Description Input to Textarea */}
        <textarea
          name="bookDescription"
          value={book.bookDescription}
          onChange={handleChange}
          placeholder="Description"
          required
          rows="6"
          cols="50"
        ></textarea>

        <input type="text" name="bookGenre" value={book.bookGenre} onChange={handleChange} placeholder="Genre" required />

        <label>Upload Book Cover:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} required />

        <select name="bookPlatform" value={book.bookPlatform} onChange={handleChange} required>
          <option value="Physical">Physical</option>
          <option value="Digital">Digital</option>
        </select>

        <div className="checkbox-container">
          <label>
            Available:
            <input type="checkbox" name="bookAvailability" checked={book.bookAvailability} onChange={handleChange} />
          </label>
        </div>

        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
