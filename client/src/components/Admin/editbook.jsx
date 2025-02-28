import React, { useState, useEffect } from "react";

const EditBook = ({ bookToEdit, onClose, onBookUpdated }) => {
  const [bookData, setBookData] = useState({
    bookTitle: "",
    bookAuthor: "",
    bookDescription: "",
    bookGenre: "",
    bookPlatform: "",
    bookAvailability: false,
  });

  useEffect(() => {
    if (bookToEdit) {
      setBookData(bookToEdit);
    }
  }, [bookToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData({
      ...bookData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3004/api/books/${bookToEdit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      const updatedBook = await response.json();
      console.log("✅ Book updated:", updatedBook);
      onBookUpdated(); // Close form & refresh list
    } catch (error) {
      console.error("❌ Error updating book:", error);
    }
  };

  return (
    <div style={styles.editBookForm}>
      <h2 style={styles.heading}>✏ Edit Book</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Title:</label>
        <input
          type="text"
          name="bookTitle"
          value={bookData.bookTitle}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Author:</label>
        <input
          type="text"
          name="bookAuthor"
          value={bookData.bookAuthor}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Description:</label>
        <textarea
          name="bookDescription"
          value={bookData.bookDescription}
          onChange={handleChange}
          style={styles.textarea}
        />

        <label style={styles.label}>Genre:</label>
        <input
          type="text"
          name="bookGenre"
          value={bookData.bookGenre}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Platform:</label>
        <input
          type="text"
          name="bookPlatform"
          value={bookData.bookPlatform}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>
          Available:
          <input
            type="checkbox"
            name="bookAvailability"
            checked={bookData.bookAvailability}
            onChange={handleChange}
            style={styles.checkbox}
          />
        </label>

        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.saveButton}>💾 Save Changes</button>
          <button type="button" onClick={onClose} style={styles.cancelButton}>❌ Cancel</button>
        </div>
      </form>
    </div>
  );
};

// Inline Styles
const styles = {
  editBookForm: {
    background: "linear-gradient(145deg, #fff8f3, #f2e1d5)",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.15)",
    maxWidth: "500px",
    margin: "20px auto",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#5c3d2e",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#7a6652",
    textAlign: "left",
    marginBottom: "5px",
  },
  input: {
    padding: "10px",
    border: "1px solid #c8a383",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.3s ease-in-out",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #c8a383",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    height: "80px",
    resize: "none",
  },
  checkbox: {
    marginLeft: "10px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  saveButton: {
    padding: "10px 15px",
    background: "#b77b43",
    color: "white",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "bold",
    transition: "background 0.3s ease-in-out",
  },
  cancelButton: {
    padding: "10px 15px",
    background: "#d32f2f",
    color: "white",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "bold",
    transition: "background 0.3s ease-in-out",
  },
};

export default EditBook;
