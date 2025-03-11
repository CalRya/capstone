import React, { useState, useEffect } from "react";
import axios from "axios";

function SortbyGenre() {
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // Timer state

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:3004/api/books");
        if (response.data && response.data.length > 0) {
          setBooks(response.data);
        } else {
          setFeedback("No books found in the library!");
        }
      } catch (err) {
        setFeedback("Error fetching books. Please try again.");
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setFeedback("⏳ Time's up! Game Over!");
      setGameOver(true);
      setGameStarted(false);
    }
  }, [gameStarted, timeLeft]);

  const handleStartGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setNewBook();
  };

  const handleQuitGame = () => {
    setGameStarted(false);
    setGameOver(false);
  };

  const setNewBook = () => {
    if (books.length > 0) {
      const randomBook = books[Math.floor(Math.random() * books.length)];
      setCurrentBook(randomBook);
      setFeedback("");
      setTimeLeft(30); // Reset timer for each question

      const correctGenre = randomBook.bookGenre;
      let allGenres = [...new Set(books.map((book) => book.bookGenre))]; // Unique genres
      let incorrectGenres = allGenres.filter((genre) => genre !== correctGenre);
      incorrectGenres = incorrectGenres.sort(() => 0.5 - Math.random()).slice(0, 3); // Pick 3 random wrong options

      const shuffledOptions = [correctGenre, ...incorrectGenres].sort(() => 0.5 - Math.random());
      setOptions(shuffledOptions);
    }
  };

  const handleGuess = (selectedGenre) => {
    if (selectedGenre === currentBook.bookGenre) {
      setFeedback("✅ Correct!");
      setScore(score + 1);
      setTimeout(() => {
        setNewBook();
      }, 1000);
    } else {
      setFeedback(`❌ Wrong! The correct genre was: ${currentBook.bookGenre}`);
      setGameOver(true);
      setGameStarted(false);
    }
  };

  const styles = {
    app: {
      backgroundColor: "#F5E1C8",
      borderRadius: "12px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      padding: "30px",
      width: "90%",
      maxWidth: "500px",
      textAlign: "center",
    },
    h1: {
      fontSize: "2rem",
      color: "#5a3e2b",
      fontWeight: "bold",
    },
    bookTitle: {
      fontSize: "1.5rem",
      margin: "10px 0",
    },
    bookCover: {
      width: "200px",
      height: "300px",
      objectFit: "cover",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
      marginBottom: "15px",
    },
    genreButton: {
      display: "block",
      width: "100%",
      padding: "12px",
      fontSize: "1.2rem",
      borderRadius: "8px",
      margin: "8px 0",
      cursor: "pointer",
      background: "#8B5E3C",
      color: "white",
      border: "none",
      transition: "0.3s",
    },
    timer: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: timeLeft <= 10 ? "red" : "#5a3e2b", // Turns red when 10 sec left
    },
    feedback: {
      marginTop: "10px",
      fontSize: "1.2rem",
      color: "#5a3e2b",
      fontWeight: "bold",
    },
    score: {
      fontSize: "1.5rem",
      marginTop: "20px",
    },
    exitButton: {
      marginTop: "20px",
      border: "none",
      padding: "10px 14px",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "20px",
      fontWeight: "bold",
      color: "white",
      background: "#8B5E3C",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    },
  };

  if (!gameStarted && !gameOver) {
    return (
      <div style={styles.app}>
        <h1 style={styles.h1}>Welcome to Guess the Genre!</h1>
        <p>Test your knowledge by guessing the genre of books!</p>
        <button style={styles.genreButton} onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div style={styles.app}>
        <h1 style={styles.h1}>Game Over!</h1>
        <p style={styles.feedback}>{feedback}</p>
        <p style={styles.score}>Your final score: {score}</p>
        <button style={styles.genreButton} onClick={handleStartGame}>
          Play Again
        </button>
        <button style={styles.exitButton} onClick={handleQuitGame}>
          Quit
        </button>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <h1 style={styles.h1}>Guess the Genre!</h1>

      {currentBook && (
        <div>
          <p style={styles.bookTitle}>Book: {currentBook.bookTitle}</p>
          {currentBook.bookCoverUrl && (
            <img
              src={`http://localhost:3004${currentBook.bookCoverUrl}`}
              alt="Book Cover"
              style={styles.bookCover}
            />
          )}
          <p style={styles.timer}>⏳ Time Left: {timeLeft}s</p>
          <p style={styles.score}>Score: {score}</p>

          {options.map((option, index) => (
            <button
              key={index}
              style={styles.genreButton}
              onClick={() => handleGuess(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <button style={styles.exitButton} onClick={handleQuitGame}>
        Quit
      </button>
    </div>
  );
}

export default SortbyGenre;
