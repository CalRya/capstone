import { useEffect, useState } from "react";
import axios from "axios";
import "../CSS FOLDER/approvedBorrowBooks.css"; // Import the CSS file

const ApproveBorrowRequests = () => {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");

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

  const calculateLateFee = (dueDate, returnDate) => {
    const due = new Date(dueDate);
    const returned = returnDate ? new Date(returnDate) : new Date(); // Use today's date if not returned
    
    if (returned <= due) return "No Fee";
    
    const daysLate = Math.ceil((returned - due) / (1000 * 60 * 60 * 24));
    return `₱${15 + (daysLate - 1) * 5}`;
  };

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
    try {
      const response = await axios.put(`http://localhost:3004/api/borrow/return/${borrowId}`);
      alert(response.data.message || "Book returned successfully!");
      setBorrowRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === borrowId
            ? { 
                ...request, 
                status: "returned", 
                returnDate: response.data.returnDate || new Date().toISOString() 
              }
            : request
        )
      );
    } catch (error) {
      console.error("❌ Error returning book:", error);
      alert("Failed to return book. Please try again.");
    }
  };

  const handleSendOverdueNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:3004/api/borrow/overdue/notify");
      setNotificationMessage(response.data.message || "Overdue notifications sent successfully!");
      setTimeout(() => setNotificationMessage(""), 5000);
    } catch (error) {
      console.error("❌ Error sending overdue notifications:", error);
      setNotificationMessage("Failed to send overdue notifications.");
      setTimeout(() => setNotificationMessage(""), 5000);
    }
  };

  // ✅ Sort by borrowDate only (latest first)
  const sortedRequests = [...borrowRequests].sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));

  return (
    <div className="borrow-requests-container">
      <h2>Borrow Requests</h2>
      
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
              <th>Return Date</th>
              <th>Late Fee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedRequests.map((request) => {
              const lateFee = calculateLateFee(request.dueDate, request.returnDate);
              return (
                <tr key={request._id}>
                  <td>{request.book?.bookTitle || "Unknown Book"}</td>
                  <td>{request.user?.user || "Unknown User"}</td>
                  <td>{new Date(request.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(request.dueDate).toLocaleDateString()}</td>
                  <td>{request.returnDate ? new Date(request.returnDate).toLocaleDateString() : "Not Returned"}</td>
                  <td>{lateFee}</td>
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
              );
            })}
          </tbody>
        </table>
      )}

      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default ApproveBorrowRequests;
