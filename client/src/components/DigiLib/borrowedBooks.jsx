import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../CSS FOLDER/borrowedBook.css";


const BorrowedBooks = ({ id: propId }) => {
  const { id: paramId } = useParams();
  const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const localStorageId = storedUser?.id || null;
  const id = propId || paramId || localStorageId;

  console.log("🟢 User ID in BorrowedBooks:", id);

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
        console.warn("❌ No user ID provided. Skipping API call.");
        setLoading(false);
        return;
    }

    const fetchBorrowedBooks = async () => {
      try {
          const token = localStorage.getItem("token"); // ✅ Retrieve the token
          const response = await axios.get(`http://localhost:3004/api/borrow/${id}`, {
              headers: { Authorization: `Bearer ${token}` } // ✅ Attach token to request
          });
  
          setBorrowedBooks(response.data);
          console.log("✅ Borrowed Books Response:", response.data);
      } catch (error) {
          console.error("❌ Error fetching borrowed books:", error);
          setError("Failed to load borrowed books. Please try again.");
      } finally {
          setLoading(false);
      }
  };
  
    fetchBorrowedBooks();
}, [id]);

  return (
    <div className="borrowed-books-container">
    <h2 className="borrowed-books-title">Borrowed Books</h2>
    {borrowedBooks.length > 0 ? (
      <ul className="borrowed-books-list">
{borrowedBooks.map((borrow) => {
  const today = new Date();
  const dueDate = borrow.dueDate ? new Date(borrow.dueDate) : null;
  const returnDate = borrow.returnDate ? new Date(borrow.returnDate) : null;

  // ✅ Use the status field directly from MongoDB
  let statusText = borrow.status; // "pending", "approved", "returned", "overdue"
  let statusClass = "";

  switch (borrow.status) {
    case "pending":
      statusText = "Pending";
      statusClass = "status-pending";
      break;
    case "approved":
      statusText = today > dueDate ? "Overdue" : "Borrowed"; // Auto-mark overdue
      statusClass = today > dueDate ? "status-overdue" : "status-borrowed";
      break;
    case "returned":
      statusText = "Returned";
      statusClass = "status-returned";
      break;
    case "overdue":
      statusText = "Overdue";
      statusClass = "status-overdue";
      break;
    case "denied":
      statusText = "Denied";
      statusClass = "status-denied";
      break;
    default:
      statusText = "Unknown";
      statusClass = "status-unknown";
  }
  
  return (
    <li key={borrow._id} className="borrowed-book-item">
      {borrow.book?.bookCoverUrl && (
        <img
          src={`http://localhost:3004${borrow.book.bookCoverUrl}`}
          alt={borrow.book.bookTitle}
          className="book-image"
        />
      )}
      <div className="book-details">
        <h3 className="book-title">{borrow.book?.bookTitle || "Unknown Title"}</h3>
        <p className="book-info"><strong>Author:</strong> {borrow.book?.bookAuthor || "Unknown Author"}</p>
        <p className="book-info"><strong>Genre:</strong> {borrow.book?.bookGenre || "Unknown Genre"}</p>
        <p className="book-info"><strong>Platform:</strong> {borrow.book?.bookPlatform || "Unknown Platform"}</p>
        <p className="borrowed-date"><strong>Borrowed:</strong> {borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : "N/A"}</p>
        <p className="borrowed-date"><strong>Due:</strong> {dueDate ? dueDate.toLocaleDateString() : "N/A"}</p>
        {returnDate && <p className="borrowed-date"><strong>Returned:</strong> {returnDate.toLocaleDateString()}</p>}
        <p className={`status ${statusClass}`}>{statusText}</p>
      </div>
    </li>
  );
})}
      </ul>
    ) : (
      <p className="no-books">No borrowed books found.</p>
    )}
  </div>
  
  );
};

export default BorrowedBooks;
  