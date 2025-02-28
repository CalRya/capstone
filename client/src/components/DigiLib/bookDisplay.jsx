import React, { useEffect, useState } from "react";
import axios from "axios";
import BorrowBookButton from "./borrowButton"; // ✅ Correct import
import "../CSS FOLDER/bookdisplay.css";

const BookDisplay = () => {
  const [books, setBooks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:3004/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    const interval = setInterval(fetchBooks, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const openModal = (book) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="book-display-container">
      <h1>Books</h1>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book._id} className="book-card" onClick={() => openModal(book)}>
              <img src={`http://localhost:3004${book.bookCoverUrl}`} alt="Book Cover" />
              <h2>{book.bookTitle}</h2>
              <p><strong>Author:</strong> {book.bookAuthor}</p>
              <p><strong>Genre:</strong> {book.bookGenre}</p>
              <p><strong>Platform:</strong> {book.bookPlatform}</p>
              <p className={`availability ${book.bookAvailability ? "available" : "unavailable"}`}>
                {book.bookAvailability ? "Available" : "Not Available"}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* 📌 Book Detail Modal */}
      {selectedBook && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <img src={`http://localhost:3004${selectedBook.bookCoverUrl}`} alt="Book Cover" />
            <h2>{selectedBook.bookTitle}</h2>
            <p><strong>Author:</strong> {selectedBook.bookAuthor}</p>
            <p><strong>Genre:</strong> {selectedBook.bookGenre}</p>
            <p><strong>Platform:</strong> {selectedBook.bookPlatform}</p>
            <p><strong>Description:</strong> {selectedBook.bookDescription}</p>
            <p className={`availability ${selectedBook.bookAvailability ? "available" : "unavailable"}`}>
              {selectedBook.bookAvailability ? "Available" : "Not Available"}
            </p>
            {currentUser ? (
              <BorrowBookButton bookID={selectedBook._id} userId={currentUser.id} className="borrow-button" />
            ) : (
              <p>Please log in to borrow books.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDisplay;
