// Variables
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const gameContainer = document.getElementById('game-container');
const target = document.getElementById('target');
const scoreboard = document.getElementById('scoreboard');
const timerDisplay = document.getElementById('timer');
const scoreList = document.getElementById('score-list');
const nameInput = document.getElementById('name-input');
const playerNameInput = document.getElementById('player-name');
const submitNameButton = document.getElementById('submit-name');

let score = 0;
let timeLeft = 30;
let timerInterval = null;
let totalClicks = 0;
let successfulHits = 0;
let topScores = JSON.parse(localStorage.getItem('topScores')) || [];
let gameStarted = false;

function displayTopScores() {
    scoreList.innerHTML = '';
    const top10 = topScores.slice(0, 10);
    top10.forEach(score => {
        const div = document.createElement('div');
        div.classList.add('score-entry');
        div.innerHTML = `
            <span>${score.level}</span>
            <span>${score.accuracy}%</span>
            <span>${score.name || score.solanaAddress}</span>
        `;
        scoreList.appendChild(div);
    });
}

function sortTopScores() {
    topScores.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return b.accuracy - a.accuracy;
    });
}

function moveTarget() {
    const maxWidth = gameContainer.clientWidth - target.clientWidth;
    const maxHeight = gameContainer.clientHeight - target.clientHeight;
    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);
    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
}

target.addEventListener('click', () => {
    if (gameStarted && timeLeft > 0) {
        score++;
        successfulHits++;
        totalClicks++;
        scoreboard.textContent = `Score: ${score}`;
        moveTarget();
    }
});

gameContainer.addEventListener('click', (event) => {
    if (gameStarted && event.target !== target && timeLeft > 0) {
        totalClicks++;
    }
});

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert(`Game Over! Your score is ${score}`);
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameStarted = false;
    target.style.pointerEvents = 'none';
    gameContainer.style.display = 'none';
    restartButton.style.display = 'block';

    const accuracy = totalClicks > 0 ? ((successfulHits / totalClicks) * 100).toFixed(2) : 0;

    if (topScores.length < 10 || score > topScores[9].score || 
        (score === topScores[9].score && accuracy > topScores[9].accuracy)) {
        nameInput.style.display = 'block';
    }
}

function submitName() {
    const playerInput = playerNameInput.value.trim();
    if (playerInput.length > 0 && playerInput.length <= 100) {
        const accuracy = totalClicks > 0 ? ((successfulHits / totalClicks) * 100).toFixed(2) : 0;
        const newScore = { name: playerInput, level: score, accuracy: accuracy };

        topScores = topScores.filter(score => score.name !== "Temporary Name");
        topScores.push(newScore);
        sortTopScores();
        topScores = topScores.slice(0, 10);

        localStorage.setItem('topScores', JSON.stringify(topScores));

        displayTopScores();
        nameInput.style.display = 'none';
        restartButton.style.display = 'block';
    } else {
        alert("Please enter a valid name or Solana address (1-100 characters).");
    }
}

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    gameContainer.style.display = 'block';
    target.style.pointerEvents = 'auto';
    gameStarted = true;
    moveTarget();
    startTimer();
});

restartButton.addEventListener('click', () => {
    score = 0;
    timeLeft = 30;
    totalClicks = 0;
    successfulHits = 0;
    scoreboard.textContent = `Score: 0`;
    timerDisplay.textContent = `Time: 30`;
    gameContainer.style.display = 'block';
    restartButton.style.display = 'none';
    target.style.pointerEvents = 'auto';
    gameStarted = true;
    moveTarget();
    startTimer();
});

submitNameButton.addEventListener('click', submitName);

displayTopScores();
