import React, { useState, useEffect } from "react";

const BookListEdit = ({ onEdit, searchQuery }) => { // ✅ Accept searchQuery as a prop
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3004/api/books")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  // ✅ Filter books based on searchQuery
  const filteredBooks = books.filter(book =>
    book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.bookListContainer}>
      <h2 style={styles.heading}>Book List</h2>
      <ul style={styles.bookList}>
        {filteredBooks.map((book) => ( // ✅ Use filteredBooks instead of books
          <li key={book._id} style={styles.bookCard}>
            {book.bookCoverUrl && (
              <img
                src={`http://localhost:3004${book.bookCoverUrl}`}
                alt={`Cover of ${book.bookTitle}`}
                style={styles.bookCover}
              />
            )}
            <div style={styles.bookInfo}>
              <strong style={styles.bookTitle}>{book.bookTitle}</strong>
              <p style={styles.bookAuthor}>by {book.bookAuthor}</p>
            </div>
            <button style={styles.editButton} onClick={() => onEdit(book)}>✏ Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Inline Styles
const styles = {
  bookListContainer: {
    textAlign: "center",
    padding: "30px",
    fontFamily: "'Poppins', sans-serif",
    minHeight: "100vh",
    paddingTop: "50px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#5c3d2e",
    marginBottom: "20px",
  },
  bookList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    padding: 0,
    listStyleType: "none",
  },
  bookCard: {
    background: "linear-gradient(145deg, #ffffff, #f5e6d6)",
    borderRadius: "15px",
    boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.15)",
    width: "250px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",
    position: "relative",
    overflow: "hidden",
  },
  bookCover: {
    width: "160px",
    height: "250px",
    objectFit: "cover",
    borderRadius: "10px",
    display: "block",
    margin: "0 auto 12px auto",
  },
  bookInfo: {
    marginBottom: "12px",
  },
  bookTitle: {
    fontSize: "18px",
    color: "#5c3d2e",
    fontWeight: "bold",
    marginBottom: "6px",
  },
  bookAuthor: {
    fontSize: "14px",
    color: "#7a6652",
    margin: "4px 0",
  },
  editButton: {
    padding: "10px 15px",
    background: "#b77b43",
    color: "white",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "bold",
    transition: "background 0.3s ease-in-out",
  },
  editButtonHover: {
    background: "#965a2b",
  },
};

export default BookListEdit;
