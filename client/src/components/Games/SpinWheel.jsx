import React, { useState, useEffect } from "react";
import { SpinWheel } from "spin-wheel-game";

const SpinWheelGame = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    // Fetch random books from the database (limited to 5)
    const fetchRandomBooks = async () => {
        try {
            const response = await fetch("http://localhost:3004/api/books/random?limit=5"); // ✅ If API supports limits
            if (!response.ok) throw new Error("Failed to fetch books");

            let data = await response.json();
            console.log("Fetched books:", data); // Debugging log

            data = data.slice(0, 5); // ✅ Guarantee only 5 books

            const formattedBooks = data.map((book, index) => ({
                segmentText: book.bookTitle, // ✅ Full title (No cutting off)
                segColor: getWheelColors(index),
                coverImage: book.bookCoverUrl ? `http://localhost:3004${book.bookCoverUrl}` : null,
                fontSize: adjustFontSize(book.bookTitle),
            }));

            setBooks(formattedBooks);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    // Adjust font size based on title length
    const adjustFontSize = (title) => {
        if (!title) return "16px";
        const length = title.length;
        if (length < 15) return "16px"; // Short titles = Default size
        if (length < 25) return "14px"; // Medium length
        if (length < 35) return "12px"; // Long titles
        return "10px"; // Extra long titles
    };

    // Generate colors that fit the brown motif
    const getWheelColors = (index) => {
        const colors = ["#C19A6B", "#8B5E3C", "#D2B48C", "#A67B5B", "#7D4E2D"];
        return colors[index % colors.length];
    };

    // Handle spin result
    const handleSpinFinish = (selectedTitle) => {
        console.log(`Spun to: ${selectedTitle}`);

        const foundBook = books.find(book => book.segmentText === selectedTitle);
        if (foundBook) {
            setSelectedBook(foundBook);
        }
    };

    // Start the game
    const startGame = async () => {
        setGameStarted(true);
        setSelectedBook(null);
        await fetchRandomBooks();
    };

    // Exit the game
    const exitGame = () => {
        setGameStarted(false);
        setSelectedBook(null);
    };

    // Spin again and fetch new books
    const spinAgain = async () => {
        setSelectedBook(null);
        await fetchRandomBooks();
    };

    // Spin Wheel settings
    const spinWheelProps = {
        segments: books,
        onFinished: handleSpinFinish,
        primaryColor: "#8B5E3C",
        contrastColor: "white",
        buttonText: "Spin",
        isOnlyOnce: false,
        size: 240,
        upDuration: 100,
        downDuration: 600,
        fontFamily: "Century Gothic",
        arrowLocation: "top",
        showTextOnSpin: false,
        isSpinSound: true,
        textStyle: { 
            whiteSpace: "normal",
            wordWrap: "break-word",
            textAlign: "center",
            fontSize: books.length > 0 ? books[0].fontSize : "16px",
        },
    };

    return (
        <div style={styles.container}>
            {!gameStarted ? (
                <div style={styles.startScreen}>
                    <h2 style={styles.title}>📚 Spin the Wheel & Get a Book Recommendation!</h2>
                    <button style={styles.button} onClick={startGame}>Start Game</button>
                </div>
            ) : (
                <>
                    {!selectedBook ? (
                        <>
                            <h1 style={styles.title}>📖 Spin the Wheel!</h1>
                            {books.length > 0 ? (
                                <div style={styles.wheelContainer}>
                                    <SpinWheel {...spinWheelProps} />
                                </div>
                            ) : (
                                <p style={{ color: "red", fontSize: "18px" }}>❌ No books available. Check your database.</p>
                            )}
                        </>
                    ) : (
                        <div style={styles.resultContainer}>
                            <h2 style={styles.resultText}>📚 Your Recommendation:</h2>
                            {selectedBook.coverImage ? (
                                <img src={selectedBook.coverImage} alt="Book Cover" style={styles.bookCover} />
                            ) : (
                                <p style={{ fontSize: "18px", color: "gray" }}>No cover available</p>
                            )}
                            <h3 style={styles.resultTitle}>{selectedBook.segmentText}</h3>

                            {/* Spin Again Button */}
                            <button style={styles.spinAgainButton} onClick={spinAgain}>🔄 Spin Again</button>
                        </div>
                    )}
                    <button style={styles.exitButton} onClick={exitGame}>Exit Game</button>
                </>
            )}
        </div>
    );
};

// Styling
const styles = {
    container: {
        backgroundColor: "#F5E1C8",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        maxWidth: "500px",
        margin: "40px auto",
        textAlign: "center",
        fontFamily: "Century Gothic, sans-serif",
        color: "#5a3e2b",
    },
    startScreen: {
        textAlign: "center",
        padding: "20px",
    },
    title: {
        fontSize: "24px",
        marginBottom: "10px",
    },
    button: {
        border: "none",
        padding: "12px 18px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "20px",
        transition: "all 0.3s ease",
        fontWeight: "bold",
        color: "white",
        background: "linear-gradient(145deg, #D2B48C, #8B5E3C)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    },
    exitButton: {
        marginTop: "20px",
        border: "none",
        padding: "10px 14px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "20px",
        transition: "all 0.3s ease",
        fontWeight: "bold",
        color: "white",
        background: "#8B5E3C",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    },
    spinAgainButton: {
        marginTop: "15px",
        border: "none",
        padding: "10px 14px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "20px",
        transition: "all 0.3s ease",
        fontWeight: "bold",
        color: "white",
        background: "#5A3E2B",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    },
    wheelContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        opacity: "0.8",
    },
    resultContainer: {
        textAlign: "center",
        marginTop: "20px",
    },
    bookCover: {
        width: "180px",
        height: "250px",
        objectFit: "cover",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        marginTop: "10px",
    },
};

export default SpinWheelGame;
