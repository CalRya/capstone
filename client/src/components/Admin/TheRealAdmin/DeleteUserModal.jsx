import React from "react";

// 🔥 Inline CSS
const styles = {
    modalOverlay: {
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex", justifyContent: "center", alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#6D4C41",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        color: "#F5F5DC",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    },
    buttonContainer: {
        marginTop: "10px",
        display: "flex",
        justifyContent: "space-around",
    },
    deleteButton: {
        backgroundColor: "#B71C1C",
        color: "white",
        padding: "10px",
        borderRadius: "6px",
        cursor: "pointer",
        border: "none",
    },
    cancelButton: {
        backgroundColor: "#8D6E63",
        color: "white",
        padding: "10px",
        borderRadius: "6px",
        cursor: "pointer",
        border: "none",
    },
};

const DeleteUserModal = ({ user, close, confirmDelete }) => {
    if (!user) return null;

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2 style={styles.heading}>⚠ Confirm Delete</h2>
                <p>Are you sure you want to delete {user?.user}?</p>
                <div style={styles.buttonContainer}>
                    <button onClick={() => confirmDelete(user._id)} style={styles.deleteButton}>✅ Yes, Delete</button> {/* Use _id */}
                    <button onClick={close} style={styles.cancelButton}>❌ Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;
