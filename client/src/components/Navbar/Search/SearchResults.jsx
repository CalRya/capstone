import React from "react";

const SearchResults = ({ books, searchQuery }) => {
  if (!searchQuery) return null; // Hide component if no search

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="search-results-container">
      {filteredBooks.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {filteredBooks.map((book) => (
            <li key={book.id} className="search-result">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
