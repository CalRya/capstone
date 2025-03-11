import React, { useState, useEffect } from "react";
import "../CSS FOLDER/borrowBookButton.css";

const BorrowBookButton = ({ bookID }) => {
  const [loading, setLoading] = useState(false);
  const [activeBorrows, setActiveBorrows] = useState(null);
  const [storedUser, setStoredUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
  });

  const user = storedUser?.id || storedUser?._id;
  const isPremium = storedUser?.premium?.status === "lifetime";
  const borrowLimit = isPremium ? 3 : 1;

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3004/api/users/${user}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        console.log("🟢 Fetched User Data:", data);

        if (data.premium) {
          setStoredUser((prev) => ({ ...prev, premium: data.premium }));
          localStorage.setItem(
            "currentUser",
            JSON.stringify({ ...storedUser, premium: data.premium })
          );
        }
      } catch (error) {
        console.error("❌ Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [user]);

  const fetchBorrows = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:3004/api/borrow/count/${user}`);
      const data = await response.json();
      console.log("🔍 Updated Active Borrows:", data);
      setActiveBorrows(data.activeBorrows || 0);
    } catch (error) {
      console.error("❌ Error fetching borrow count:", error);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, [user]);

  const borrowBook = async () => {
    if (loading || activeBorrows === null) return;

    console.log("🔍 Borrowing Book Debug:", { bookID, user, activeBorrows, borrowLimit });

    if (!bookID || !user) {
      alert("❌ Missing book ID or user ID");
      return;
    }

    setLoading(true);
    try {
      // ✅ Fetch latest borrow count before enforcing the limit
      const responseCount = await fetch(`http://localhost:3004/api/borrow/count/${user}`);
      const dataCount = await responseCount.json();
      const updatedActiveBorrows = dataCount.activeBorrows || 0;

      if (updatedActiveBorrows >= borrowLimit) {
        alert(`⛔ Borrow limit reached! You can only borrow up to ${borrowLimit} book(s).`);
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3004/api/borrow/${bookID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });

      const data = await response.json();
      console.log("✅ Server Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to borrow book");
      }

      alert(data.message);
      fetchBorrows();
    } catch (error) {
      console.error("❌ Borrowing Error:", error);
      alert(error.message || "Failed to borrow book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={borrowBook}
      disabled={loading || activeBorrows === null || activeBorrows >= borrowLimit}
      className={`borrow-button ${loading || activeBorrows >= borrowLimit ? "disabled" : ""}`}
    >
      {loading ? "⏳ Borrowing..." : activeBorrows !== null && activeBorrows >= borrowLimit ? "Limit Reached" : "Borrow Book"}
    </button>
  );
};

export default BorrowBookButton;
