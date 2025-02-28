import { useEffect, useState } from "react";
import axios from "axios";
import "../CSS FOLDER/approvedBorrowBooks.css"; // Import the CSS file

const ApproveBorrowRequests = () => {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(""); // ✅ New state for notifications

  useEffect(() => {
    const fetchBorrowRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3004/api/borrow");
        console.log("📜 Borrow requests received (frontend):", response.data);
        setBorrowRequests(response.data);
      } catch (error) {
        console.error("❌ Error fetching borrow requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBorrowRequests();
  }, []);

  const handleApproveRequest = async (borrowId) => {
    try {
      const response = await axios.put(`http://localhost:3004/api/borrow/approve/${borrowId}`);
      setSuccessMessage(response.data.message || "Request approved successfully!");
      setBorrowRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === borrowId ? { ...request, status: "approved" } : request
        )
      );
    } catch (error) {
      console.error("❌ Error approving request:", error);
    }
  };

  const handleReturnRequest = async (borrowId) => {
    console.log("📌 Attempting to return book with Borrow ID:", borrowId);
  
    try {
      const response = await axios.put(`http://localhost:3004/api/borrow/return/${borrowId}`);
      console.log("✅ Return Response:", response.data);
      
      alert(response.data.message || "Book returned successfully!");
  
      setBorrowRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === borrowId ? { ...request, status: "returned" } : request
        )
      );
  
    } catch (error) {
      console.error("❌ Error returning book:", error);
      alert("Failed to return book. Please try again.");
    }
  };

  const handleSendOverdueNotifications = async () => {
    console.log("📢 Sending overdue notifications...");

    try {
      const response = await axios.get("http://localhost:3004/api/borrow/overdue/notify");
      console.log("✅ Overdue Notification Response:", response.data);
      
      setNotificationMessage(response.data.message || "Overdue notifications sent successfully!");
      
      // Clear the message after a few seconds
      setTimeout(() => setNotificationMessage(""), 5000);
    } catch (error) {
      console.error("❌ Error sending overdue notifications:", error);
      setNotificationMessage("Failed to send overdue notifications.");
      
      setTimeout(() => setNotificationMessage(""), 5000);
    }
  };

  return (
    <div className="borrow-requests-container">
      <h2>Borrow Requests</h2>
      
      {/* ✅ Overdue Notification Button */}
      <button className="notify-btn" onClick={handleSendOverdueNotifications}>
        Send Overdue Notifications 📩
      </button>

      {notificationMessage && <p className="notification-message">{notificationMessage}</p>}

      {loading ? (
        <p>Loading borrow requests...</p>
      ) : (
        <table className="borrow-table">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>User</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowRequests.map((request) => (
              <tr key={request._id}>
                <td>{request.book?.bookTitle || "Unknown Book"}</td>
                <td>{request.user?.user || "Unknown User"}</td>
                <td>{new Date(request.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(request.dueDate).toLocaleDateString()}</td>
                <td className={`status-${request.status}`}>{request.status}</td>
                <td>
                  {request.status === "pending" && (
                    <button className="approve-btn" onClick={() => handleApproveRequest(request._id)}>
                      Approve
                    </button>
                  )}
                  {["approved", "overdue"].includes(request.status) && (
                    <button className="return-btn" onClick={() => handleReturnRequest(request._id)}>
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default ApproveBorrowRequests;
