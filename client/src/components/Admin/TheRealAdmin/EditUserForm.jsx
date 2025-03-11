import React, { useState } from "react";

const EditUserForm = ({ user, close, refreshUsers }) => {
    const [formData, setFormData] = useState({
        user: user.user,
        email: user.email,
        role: user.role,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting edit for user ID:", user._id); // Debugging
    
        await fetch(`http://localhost:3004/api/users/${user._id}`, { // ✅ Change port to 3004
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
    
        refreshUsers();
    };
    
    

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="user" value={formData.user} onChange={handleChange} />
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            <button type="submit">Save</button>
            <button type="button" onClick={close}>Cancel</button>
        </form>
    );
};

export default EditUserForm;
