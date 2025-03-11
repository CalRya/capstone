import React, { useState } from "react";
import BookList from "../../Admin/booklist";
import EditBook from "../../Admin/editbook";
import BookListEdit from "../../Admin/BookListEdit";
import NavbarAdmin from "../../Navbar/NavbarAdmin";

function LibraryPage() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleBookUpdated = () => {
    setSelectedBook(null);
  };

  return (
    <main className="App">
      <NavbarAdmin onSearch={setSearchQuery} />
      <BookList />
      {!selectedBook ? (
        <BookListEdit onEdit={setSelectedBook} searchQuery={searchQuery} /> 
      ) : (
        <EditBook bookToEdit={selectedBook} onClose={() => setSelectedBook(null)} onBookUpdated={handleBookUpdated} />
      )}
    </main>
  );
}

export default LibraryPage;
