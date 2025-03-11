import React, { useState, useEffect } from "react";

const QuoteGuessingGame = () => {
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [guess, setGuess] = useState("");
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(localStorage.getItem("highScore") || 0);
    const [skipsLeft, setSkipsLeft] = useState(3);
    const [timer, setTimer] = useState(15);
    const [gameOver, setGameOver] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (gameStarted && timer > 0 && !gameOver) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        } else if (gameStarted && timer === 0) {
            handleGameOver();
        }
    }, [timer, gameOver, gameStarted]);

    const loadNextQuote = async () => {
        if (skipsLeft <= 0) {
            handleGameOver();
            return;
        }
        setTimer(15);
        setAnswered(false);
        setFeedback("");
        try {
            const response = await fetch("http://localhost:3004/quote");
            if (!response.ok) throw new Error("Failed to fetch quote");
            const data = await response.json();
            setQuote(data.text);
            setAuthor(data.author);
            setGuess("");
            setSkipsLeft(skipsLeft - 1);
        } catch (error) {
            console.error("Error fetching quote:", error);
            setQuote("⚠️ Error loading quote.");
        }
    };

    const startGame = () => {
        setGameStarted(true);
        setScore(0);
        setSkipsLeft(3);
        setGameOver(false);
        loadNextQuote();
    };

    const checkGuess = () => {
        if (answered || gameOver) return;
        setAnswered(true);
        if (guess.trim().toLowerCase() === author.toLowerCase()) {
            setFeedback("✅ Correct!");
            const newScore = score + 1;
            setScore(newScore);

            // Update high score in localStorage
            if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem("highScore", newScore);
            }
        } else {
            handleGameOver();
        }
    };

    const handleGameOver = () => {
        setGameOver(true);
        setFeedback(`Game Over! High Score: ${highScore}`);
    };

    const exitGame = () => {
        setGameStarted(false);
        setGameOver(false);
        setScore(0);
        setSkipsLeft(3);
        setQuote("");
        setFeedback("");
        setTimer(15);
    };

    return (
        <div style={styles.container}>
            {!gameStarted ? (
                <div style={styles.startScreen}>
                    <h2 style={styles.text}>📖 Welcome to the Quote Guessing Game!</h2>
                    <p style={styles.text}>Try to guess which book the quote is from.</p>
                    <button style={styles.button} onClick={startGame}>Start Game</button>
                    <p style={styles.highScore}>🏆 High Score: {highScore}</p>
                </div>
            ) : gameOver ? (
                <div style={styles.gameOverScreen}>
                    <h2 style={styles.text}>Game Over!</h2>
                    <p style={styles.text}>High Score: {highScore}</p>
                    <button style={styles.button} onClick={startGame}>Play Again</button>
                    <button style={styles.exitButton} onClick={exitGame}>Exit Game</button>
                </div>
            ) : (
                <>
                    <h1 style={styles.title}>📖 Quote Guessing Game</h1>
                    <div style={styles.quoteBox}>
                        <p style={styles.quoteText}>"{quote}"</p>
                    </div>
                    <p style={styles.timer}>⏳ Time Left: {timer}s</p>
                    <input
                        type="text"
                        placeholder="Enter your guess..."
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        style={styles.input}
                        disabled={answered}
                    />
                    <button style={styles.button} onClick={checkGuess} disabled={answered}>Submit</button>
                    <button style={styles.button} onClick={loadNextQuote} disabled={skipsLeft <= 0 || answered}>
                        Skip ({skipsLeft} left)
                    </button>
                    <button style={styles.exitButton} onClick={exitGame}>Exit Game</button>
                    <p style={styles.feedback}>{feedback}</p>
                    <p style={styles.score}>🏆 Score: {score} | High Score: {highScore}</p>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "#f8e8d0",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        maxWidth: "500px",
        margin: "40px auto",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
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
    quoteBox: {
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        marginBottom: "10px",
    },
    quoteText: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#8b5e3c",
    },
    timer: {
        fontSize: "16px",
        color: "#b87d4b",
        marginBottom: "10px",
    },
    input: {
        width: "90%",
        padding: "10px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #d2b48c",
        backgroundColor: "#f5e1c5",
        textAlign: "center",
        outline: "none",
        marginBottom: "10px",
    },
    button: {
        border: "none",
        padding: "10px 14px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "20px",
        transition: "all 0.3s ease",
        fontWeight: "bold",
        color: "white",
        margin: "5px",
        background: "linear-gradient(145deg, #e6b07e, #b87d4b)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    },
    exitButton: {
        border: "none",
        padding: "10px 14px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "20px",
        transition: "all 0.3s ease",
        fontWeight: "bold",
        color: "white",
        margin: "5px",
        background: "#8b5e3c",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    },
    feedback: {
        fontSize: "18px",
        color: "#8b5e3c",
        marginTop: "10px",
        fontWeight: "bold",
    },
    highScore: {
        fontSize: "18px",
        color: "#5a3e2b",
        fontWeight: "bold",
        marginTop: "10px",
    },
};

export default QuoteGuessingGame;
