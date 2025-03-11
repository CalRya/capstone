let currentQuote = '';
let currentAnswer = '';

const quoteText = document.getElementById('quote-text');
const guessInput = document.getElementById('guess-input');
const submitButton = document.getElementById('submit-btn');
const feedback = document.getElementById('feedback');
const nextQuoteButton = document.getElementById('next-quote-btn');

// Fetch a new quote dynamically from the backend
function loadNextQuote() {
    quoteText.textContent = "Loading quote..."; // Show loading state

    fetch('http://localhost:5500/quote') // Ensure correct API endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch quote: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.text) {
                throw new Error("Invalid quote data received");
            }
            currentQuote = data.text;
            currentAnswer = data.author;
            quoteText.textContent = `"${currentQuote}"`; // Display new quote
            guessInput.value = ''; // Clear input
            feedback.textContent = ''; // Clear feedback
            feedback.style.color = '';
        })
        .catch(error => {
            console.error("❌ Error fetching quote:", error);
            quoteText.textContent = "⚠️ Error loading quote. Try again later.";
        });
}

// Check if the guess is correct
function checkGuess() {
    const guess = guessInput.value.trim();

    if (guess === '') {
        feedback.textContent = ''; // Do nothing if input is empty
        return;
    }

    if (guess.toLowerCase() === currentAnswer.toLowerCase()) {
        feedback.textContent = 'Correct!';
        feedback.style.color = 'green';
    } else {
        feedback.textContent = `Wrong! The correct answer was: ${currentAnswer}`;
        feedback.style.color = 'red';
    }
}

// Event listeners
submitButton.addEventListener('click', checkGuess);
nextQuoteButton.addEventListener('click', loadNextQuote);

// Load the first quote on page load dynamically
window.onload = loadNextQuote;