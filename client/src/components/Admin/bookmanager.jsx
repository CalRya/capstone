// components/BookManager.js
import React, { useState } from 'react';
import BookList from './booklist';
import AddBook from './addbook';
import EditBook from './editbook';

const BookManager = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    const response = await axios.get('/api/books');
    setBooks(response.data);
  };  

  const handleAddBook = (book) => {
    setBooks([...books, book]);
  };

  const handleEditBook = (book) => {
    setBooks(books.map(b => (b._id === book._id ? book : b)));
  };

  const handleDeleteBook = async (id) => {
    await axios.delete(`/api/books/${id}`);
    setBooks(books.filter(b => b._id !== id));
  };

  return (
    <div>
      <h1>Library Book Manager</h1>
      <AddBook onAdd={handleAddBook} />
      {selectedBook ? (
        <EditBook book={selectedBook} onEditBook={handleEditBook} />
      ) : (
        <BookList onEdit={setSelectedBook} onDelete={handleDeleteBook} />
      )}
    </div>
  );
};

export default BookManager;
