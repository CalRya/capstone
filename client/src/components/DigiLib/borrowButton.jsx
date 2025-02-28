import React, { useState } from "react";
import "../CSS FOLDER/borrowBookButton.css"; // Import the CSS file

const BorrowBookButton = ({ bookID }) => {
  const [loading, setLoading] = useState(false);
  
  // Retrieve user ID from local storage
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const user = storedUser?.id; 

  const borrowBook = async () => {
    if (loading) return; // Prevent multiple clicks

    console.log("🔍 Borrowing Book Debug: ", { bookID, user });

    if (!bookID || !user) {
      alert("Missing book ID or user ID");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3004/api/borrow/${bookID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });

      const data = await response.json();
      console.log("✅ Server Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to borrow book");
      }

      alert(data.message);
      window.location.reload(); // Reload to update availability status

    } catch (error) {
      console.error("❌ Borrowing Error:", error);
      alert("Failed to borrow book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={borrowBook}
      disabled={loading}
      className={`borrow-button ${loading ? "disabled" : ""}`}
    >
      {loading ? "⏳ Borrowing..." : "Borrow Book"}
    </button>
  );
};

export default BorrowBookButton;
