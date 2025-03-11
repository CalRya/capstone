import React, { useState, useEffect } from "react";

const EditBook = ({ bookToEdit, onClose, onBookUpdated }) => {
  const [bookData, setBookData] = useState({
    bookTitle: "",
    bookAuthor: "",
    bookDescription: "",
    bookGenre: "",
    bookPlatform: "",
    bookAvailability: false,
    bookCoverUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // When bookToEdit is updated, fill the form with book data
  useEffect(() => {
    if (bookToEdit) {
      console.log("Editing book:", bookToEdit); // Log book data for debugging
      setBookData({
        bookTitle: bookToEdit.bookTitle,
        bookAuthor: bookToEdit.bookAuthor,
        bookDescription: bookToEdit.bookDescription,
        bookGenre: bookToEdit.bookGenre,
        bookPlatform: bookToEdit.bookPlatform,
        bookAvailability: bookToEdit.bookAvailability,
        bookCoverUrl: bookToEdit.bookCoverUrl,
      });
      setPreviewImage(`http://localhost:3004${bookToEdit.bookCoverUrl}`);
    }
  }, [bookToEdit]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name, type === "checkbox" ? checked : value); // Log field changes for debugging
    setBookData({
      ...bookData,
      [name]: type === "checkbox" ? checked : value, // Ensure checkbox is a boolean
    });
  };

  // Handle file input changes (image upload)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Show preview of selected image
    }
  };

  // Submit the form to update the book
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log form data before submitting for debugging
    console.log("Form Data:", bookData);

    const formData = new FormData();
    formData.append("bookTitle", bookData.bookTitle);
    formData.append("bookAuthor", bookData.bookAuthor);
    formData.append("bookDescription", bookData.bookDescription);
    formData.append("bookGenre", bookData.bookGenre);
    formData.append("bookPlatform", bookData.bookPlatform);
    formData.append("bookAvailability", bookData.bookAvailability.toString()); // Convert boolean to string

    // Append book cover file if selected
    if (selectedFile) {
      formData.append("bookCover", selectedFile);
    }

    try {
      const response = await fetch(`http://localhost:3004/api/books/${bookToEdit._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      const updatedBook = await response.json();
      console.log("✅ Book updated:", updatedBook);
      onBookUpdated(updatedBook); // Pass the updated book
      onClose(); // Optionally close the form after updating
    } catch (error) {
      console.error("❌ Error updating book:", error);
    }
  };

  return (
    <div style={styles.editBookForm}>
      <h2 style={styles.heading}>✏ Edit Book</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {previewImage && (
          <div style={styles.imagePreviewContainer}>
            <img src={previewImage} alt="Book Cover" style={styles.previewImage} />
          </div>
        )}

        <label style={styles.label}>Change Cover:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} style={styles.fileInput} />

        <label style={styles.label}>Title:</label>
        <input type="text" name="bookTitle" value={bookData.bookTitle} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Author:</label>
        <input type="text" name="bookAuthor" value={bookData.bookAuthor} onChange={handleChange} required style={styles.input} />

        <label style={styles.label}>Description:</label>
        <textarea name="bookDescription" value={bookData.bookDescription} onChange={handleChange} style={styles.textarea} />

        <label style={styles.label}>Genre:</label>
        <input type="text" name="bookGenre" value={bookData.bookGenre} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>Platform:</label>
        <input type="text" name="bookPlatform" value={bookData.bookPlatform} onChange={handleChange} style={styles.input} />

        <label style={styles.label}>
          Available:
          <input type="checkbox" name="bookAvailability" checked={bookData.bookAvailability} onChange={handleChange} style={styles.checkbox} />
        </label>

        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.saveButton}> Save Changes</button>
          <button type="button" onClick={onClose} style={styles.cancelButton}> Cancel</button>
        </div>
      </form>
    </div>
  );
};

// ✨ **Improved Styles**
const styles = {
  editBookForm: {
    background: "linear-gradient(145deg, #fff8f3, #f2e1d5)",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "8px 8px 20px rgba(0, 0, 0, 0.12)",
    maxWidth: "550px",
    margin: "30px auto",
    textAlign: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#5c3d2e",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#7a6652",
    textAlign: "left",
    marginBottom: "5px",
  },
  input: {
    padding: "12px",
    border: "1px solid #c8a383",
    borderRadius: "6px",
    fontSize: "15px",
    outline: "none",
    transition: "border 0.3s ease-in-out",
  },
  textarea: {
    padding: "12px",
    border: "1px solid #c8a383",
    borderRadius: "6px",
    fontSize: "15px",
    outline: "none",
    height: "100px",
    resize: "none",
  },
  fileInput: {
    padding: "10px",
    border: "1px solid #c8a383",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
    background: "#f9f1ea",
  },
  imagePreviewContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
  },
  previewImage: {
    width: "100%",
    maxHeight: "220px", // Sleek rectangular cover
    objectFit: "cover",
    borderRadius: "8px",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
    border: "1px solid #ddd",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    gap: "15px", // Adds spacing between buttons
  },
  saveButton: {
    padding: "12px 18px",
    background: "#b77b43",
    color: "white",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "background 0.3s ease-in-out",
  },
  cancelButton: {
    padding: "12px 18px",
    background: "#d32f2f",
    color: "white",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "background 0.3s ease-in-out",
  },
};

export default EditBook;
