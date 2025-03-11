import React, { useState } from "react";

const AddUserForm = ({ refreshUsers }) => {
    const [formData, setFormData] = useState({
        user: "",
        email: "",
        password: "",
        role: "student",
    });

    const [formVisible, setFormVisible] = useState(true);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("📩 Submitting new user:", formData);

        const response = await fetch("http://localhost:3004/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            console.log("✅ User added successfully!");
            refreshUsers();
            setFormVisible(false); // Close the form after submitting
        } else {
            console.error("❌ Error adding user:", await response.json());
        }
    };

    if (!formVisible) {
        return (
            <div style={styles.messageContainer}>
                <p>User added successfully!</p>
            </div>
        );
    }

    const styles = {
        formContainer: {
            width: "100%",
            maxWidth: "1200px", // Ensuring same width as UserTable
            padding: "20px",
            backgroundColor: "#FAF3E0", // Soft beige background
            borderRadius: "10px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            marginTop: "20px",
        },
        input: {
            padding: "12px",
            margin: "10px 0",
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #D2B48C",
            fontSize: "16px",
        },
        select: {
            padding: "12px",
            margin: "10px 0",
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #D2B48C",
            fontSize: "16px",
        },
        button: {
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#8E735B", // Brown button
            color: "white",
            border: "none",
            fontWeight: "bold",
            marginTop: "15px",
            transition: "all 0.3s ease",
        },
        cancelButton: {
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#D94F48", // Red button
            color: "white",
            border: "none",
            fontWeight: "bold",
            marginTop: "10px",
            transition: "all 0.3s ease",
        },
        messageContainer: {
            padding: "20px",
            backgroundColor: "#FAE1DC", // Soft pink background
            borderRadius: "10px",
            textAlign: "center",
            color: "#8B6F47",
            fontSize: "18px",
            fontStyle: "italic",
        },
    };

    return (
        <div style={styles.formContainer}>
            <form onSubmit={handleSubmit}>
                <input
                    style={styles.input}
                    type="text"
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                />
                <input
                    style={styles.input}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    style={styles.input}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <select style={styles.select} name="role" value={formData.role} onChange={handleChange}>
                    <option value="student">Student</option>
                    <option value="librarian">Librarian</option>
                    <option value="admin">Admin</option>
                </select>
                <button style={styles.button} type="submit">Add User</button>
                <button style={styles.cancelButton} type="button" onClick={() => setFormVisible(false)}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AddUserForm;
