import React, { useEffect, useState } from "react";
import axios from "axios";
import BorrowBookButton from "./borrowButton";
import "../CSS FOLDER/bookdisplay.css";

const BookDisplay = ({ searchQuery }) => {
    const [books, setBooks] = useState([]);
    const [ratingUpdated, setRatingUpdated] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [sortOption, setSortOption] = useState(""); // State for sorting

    // Fetch Books - Updates when ratingUpdated changes
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get("http://localhost:3004/api/books");
                console.log("📥 Books API Response:", response.data);

                const updatedBooks = response.data.map((book) => {
                    if (book.averageRating && book.averageRating !== null) {
                        book.averageRating = book.averageRating.toFixed(1);
                    } else {
                        book.averageRating = "No ratings yet";
                    }
                    return book;
                });

                setBooks(updatedBooks);
            } catch (error) {
                console.error("Failed to fetch books:", error);
            }
        };

        fetchBooks();
    }, [ratingUpdated]);

    // Refresh books when a rating is submitted
    const handleRatingUpdate = () => {
        setRatingUpdated((prev) => !prev);
    };

    // Load current user
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    // Open & Close Modal
    const openModal = (book) => setSelectedBook(book);
    const closeModal = () => setSelectedBook(null);

    // Function to convert newline characters into <br /> tags
    const formatDescription = (description) => {
        if (!description) return "";
        return description.split("\n").map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    // Function to sort books based on selected option
    const sortBooks = (books) => {
        if (sortOption === "title") {
            return [...books].sort((a, b) => a.bookTitle.localeCompare(b.bookTitle));
        } else if (sortOption === "author") {
            return [...books].sort((a, b) => a.bookAuthor.localeCompare(b.bookAuthor));
        } else if (sortOption === "genre") {
            return [...books].sort((a, b) => a.bookGenre.localeCompare(b.bookGenre));
        }
        return books; // Default order if no sorting is applied
    };

    // Filter and sort books based on user input
    const filteredAndSortedBooks = sortBooks(
        books.filter((book) =>
            book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    return (
        <div className="book-display-container">
            <h1>Books</h1>

            {/* Sorting Dropdown */}
            <div className="sort-container">
                <label htmlFor="sort">Sort By: </label>
                <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="">Default</option>
                    <option value="title">Alphabetical (Title)</option>
                    <option value="author">Author</option>
                    <option value="genre">Genre</option>
                </select>
            </div>

            {filteredAndSortedBooks.length === 0 ? (
                <p>No books found.</p>
            ) : (
                <ul className="book-list">
                    {filteredAndSortedBooks.map((book) => (
                        <li key={book._id} className="book-card" onClick={() => openModal(book)}>
                            <img src={`http://localhost:3004${book.bookCoverUrl}`} alt="Book Cover" />
                            <h2>{book.bookTitle}</h2>
                            <p><strong>Author:</strong> {book.bookAuthor}</p>
                            <p><strong>Genre:</strong> {book.bookGenre}</p>
                            <p><strong>Platform:</strong> {book.bookPlatform}</p>
                            <p className={`availability ${book.bookAvailability ? "available" : "unavailable"}`}>
                                {book.bookAvailability ? "Available" : "Not Available"}
                            </p>
                            <p><strong>Average Rating:</strong> {book.averageRating} ⭐</p>
                        </li>
                    ))}
                </ul>
            )}

            {/* Book Detail Modal */}
            {selectedBook && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={closeModal}>&times;</span>
                        <img src={`http://localhost:3004${selectedBook.bookCoverUrl}`} alt="Book Cover" />
                        <h2>{selectedBook.bookTitle}</h2>
                        <p><strong>Author:</strong> {selectedBook.bookAuthor}</p>
                        <p><strong>Genre:</strong> {selectedBook.bookGenre}</p>
                        <p><strong>Platform:</strong> {selectedBook.bookPlatform}</p>
                        <p><strong>Description:</strong></p>
                        <div className="book-description">
                            {formatDescription(selectedBook.bookDescription)}
                        </div>
                        <p><strong>Average Rating:</strong> {selectedBook.averageRating} ⭐</p>
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
