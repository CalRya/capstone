import React, { useState } from "react"; // ✅ Added useState import
import BookList from "../../Admin/booklist";
import EditBook from "../../Admin/editbook";
import BookListEdit from "../../Admin/BookListEdit";
import Navbar from "../../Navbar/NavbarAdmin";
import BookDisplay from "../../DigiLib/bookDisplay";




function LibraryPage() {
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookUpdated = () => {
    setSelectedBook(null); // Close edit form after update
  };

  return (
    <main className="App">
      <Navbar />
      <BookList/>
      {!selectedBook ? (
        <BookListEdit onEdit={setSelectedBook} />
      ) : (
        <EditBook
          bookToEdit={selectedBook}
          onClose={() => setSelectedBook(null)}
          onBookUpdated={handleBookUpdated}
        />
      )}
      <BookDisplay />
    </main>
  );
}

export default LibraryPage;
