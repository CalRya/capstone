import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../CSS FOLDER/libraryPreview.css";

const LibraryPreview = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:3004/api/books");
        setBooks(response.data.slice(0, 5)); // Limit to 5 books
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="library-preview">
      <h2>Explore Our Library</h2>
      <div className="book-preview-container"> {/* ✅ Add container back */}
        <div className="book-preview-list">
          {books.map((book) => (
            <div key={book._id} className="book-card">
              <img
                src={`http://localhost:3004${book.bookCoverUrl}`}
                alt="Book Cover"
                className="book-cover"
              />
              <p className="book-title">{book.bookTitle}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="more-books-container"> {/* ✅ This centers the button */}
        <Link to="/lib" className="more-books-btn">More Books</Link>
      </div>
    </div>
  );
};

export default LibraryPreview;
