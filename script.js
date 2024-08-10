document.addEventListener('DOMContentLoaded', () => {
    class Hangman {
        constructor(word, maxAttempts = 6) {
            this.word = word.toLowerCase();
            this.guesses = [];
            this.maxAttempts = maxAttempts;
            this.remainingAttempts = maxAttempts;
            this.correctGuesses = Array(this.word.length).fill('_');
            this.startTime = Date.now();
        }

        guess(letter) {
            if (this.guesses.includes(letter)) {
                return false;
            }
            this.guesses.push(letter);
            if (this.word.includes(letter)) {
                for (let i = 0; i < this.word.length; i++) {
                    if (this.word[i] === letter) {
                        this.correctGuesses[i] = letter;
                    }
                }
                return true;
            } else {
                this.remainingAttempts--;
                return false;
            }
        }

        isGameOver() {
            return this.remainingAttempts === 0 || !this.correctGuesses.includes('_');
        }

        isWin() {
            return !this.correctGuesses.includes('_');
        }

        getWordDisplay() {
            return this.correctGuesses.join(' ');
        }

        getElapsedTime() {
            return Math.floor((Date.now() - this.startTime) / 1000);
        }

        getPoints() {
            return this.isWin() ? (this.word.length * 10) : 0;
        }
    }

    async function fetchRandomWord() {
        try {
            const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
            const data = await response.json();
            return data[0];
        } catch (error) {
            console.error('Error fetching word:', error);
            return 'error';
        }
    }

    async function startGame() {
        const word = await fetchRandomWord();
        const hangman = new Hangman(word);

        const wordDisplay = document.getElementById('word-display');
        const letterInput = document.getElementById('letter-input');
        const guessButton = document.getElementById('guess-button');
        const message = document.getElementById('message');
        const remainingAttempts = document.getElementById('remaining-attempts');
        const playerName = document.getElementById('player-name').value;

        wordDisplay.textContent = hangman.getWordDisplay();
        remainingAttempts.textContent = `Intentos restantes: ${hangman.remainingAttempts}`;

        guessButton.addEventListener('click', () => {
            const letter = letterInput.value.toLowerCase();
            if (letter && letter.length === 1) {
                const correct = hangman.guess(letter);
                
                wordDisplay.textContent = hangman.getWordDisplay();
                remainingAttempts.textContent = `Intentos restantes: ${hangman.remainingAttempts}`;

                if (hangman.isGameOver()) {
                    if (hangman.isWin()) {
                        message.textContent = 'Ganaste!';
                    } else {
                        message.textContent = `Juego terminado. La palabra era: ${hangman.word}`;
                    }
                    letterInput.disabled = true;
                    guessButton.disabled = true;

                    const scoreData = {
                        nombre: playerName,
                        tiempo: hangman.getElapsedTime(),
                        puntos: hangman.getPoints(),
                        fecha: new Date().toISOString().split('T')[0]
                    };

                    fetch('./db.js', {
                        //fetch('http://localhost:3000/score', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(scoreData)
                    })
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.error('Error:', error));
                }
                letterInput.value = '';
            }
        });
    }

    document.getElementById('start-game').addEventListener('click', () => {
        const playerName = document.getElementById('player-name').value;
        if (playerName.trim()) {
            document.getElementById('player-container').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            startGame();
        } else {
            alert('Por favor, ingresa tu nombre.');
        }
    });
});
