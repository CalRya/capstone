import React, { useState } from "react";
import EditUserForm from "./EditUserForm";
import DeleteUserModal from "./DeleteUserModal";

const UserTable = ({ users = [], refreshUsers }) => {
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);

    // 🔄 Handle Role Change
    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`http://localhost:3004/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update role. Status: ${response.status}`);
            }

            console.log(`✅ Role updated for user ${userId} to ${newRole}`);
            refreshUsers(); // Refresh users after update
        } catch (error) {
            console.error("❌ Error updating role:", error.message);
        }
    };

    const confirmDelete = async (userId) => {
        console.log(`Deleting user with ID: ${userId}`);

        try {
            const response = await fetch(`http://localhost:3004/api/users/${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                console.log("✅ User deleted successfully!");
                refreshUsers();
            } else {
                console.error("❌ Error deleting user:", await response.json());
            }
        } catch (error) {
            console.error("❌ Error:", error);
        }

        setDeletingUser(null);
    };

    const styles = {
        tableContainer: {
            width: "100%",
            padding: "20px",
            backgroundColor: "#FAF3E0",
            borderRadius: "12px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            marginTop: "20px",
            overflow: "hidden",
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "16px",
            color: "#6E4B3A",
            tableLayout: "fixed",
        },
        th: {
            backgroundColor: "#8E735B",
            color: "white",
            padding: "14px",
            textAlign: "left",
            borderBottom: "3px solid #6B4C3B",
            fontWeight: "bold",
        },
        td: {
            padding: "12px",
            borderBottom: "1px solid #D2B48C",
            backgroundColor: "#F5E1C0",
            wordWrap: "break-word",
            whiteSpace: "normal",
        },
        select: {
            padding: "5px",
            borderRadius: "5px",
            fontSize: "14px",
            backgroundColor: "#FAEBD7",
            color: "#5A3E2B",
            border: "1px solid #5A3E2B",
            cursor: "pointer",
        },
        button: {
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginRight: "8px",
            fontWeight: "bold",
            transition: "all 0.3s ease",
        },
        editButton: {
            backgroundColor: "#C88A6B",
            color: "white",
        },
        deleteButton: {
            backgroundColor: "#D94F48",
            color: "white",
        },
        noUsersMessage: {
            textAlign: "center",
            padding: "20px",
            color: "#8B6F47",
            fontSize: "18px",
            fontStyle: "italic",
        },
    };

    return (
        <div style={styles.tableContainer}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>📛 User</th>
                        <th style={styles.th}>📧 Email</th>
                        <th style={styles.th}>🎭 Role</th>
                        <th style={styles.th}>⚙️ Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user._id}>
                                <td style={styles.td}>{user.user}</td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>
                                    {/* 🔥 Role Editing Dropdown */}
                                    {user.role === "admin" ? (
                                        <strong>🔹 Admin</strong>
                                    ) : (
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            style={styles.select}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="librarian">Librarian</option>
                                            <option value="student">Student</option>
                                            <option value="courier">Courier</option>
                                        </select>
                                    )}
                                </td>
                                <td style={styles.td}>
                                    {user.role !== "admin" && (
                                        <>
                                            <button
                                                style={{ ...styles.button, ...styles.editButton }}
                                                onClick={() => setEditingUser(user)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                style={{ ...styles.button, ...styles.deleteButton }}
                                                onClick={() => setDeletingUser(user)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={styles.noUsersMessage}>
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {editingUser && (
                <EditUserForm
                    user={editingUser}
                    close={() => setEditingUser(null)}
                    refreshUsers={refreshUsers}
                />
            )}

            {deletingUser && (
                <DeleteUserModal
                    user={deletingUser}
                    close={() => setDeletingUser(null)}
                    confirmDelete={confirmDelete}
                />
            )}
        </div>
    );
};

export default UserTable;
