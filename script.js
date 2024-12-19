// Game variables
let timer = 60; // Timer duration in seconds
let timerInterval;

// Start the game and timer
function startGame() {
    document.getElementById("timer").innerText = `Time: ${timer}`;
    timerInterval = setInterval(updateTimer, 1000);
    // Add any other game initialization logic here
    console.log("Game started");
}

// Update timer and check for expiry
function updateTimer() {
    timer--;
    document.getElementById("timer").innerText = `Time: ${timer}`;
    if (timer <= 0) {
        clearInterval(timerInterval);
        showModal();
    }
}

// Show the modal when the timer expires
function showModal() {
    const modal = document.getElementById("name-modal");
    modal.classList.remove("hidden");
}

// Restart the game
function restartGame() {
    const playerName = document.getElementById("player-name").value;
    console.log(`Player Name: ${playerName}`); // Capture or use player name if needed
    const modal = document.getElementById("name-modal");
    modal.classList.add("hidden");
    timer = 60; // Reset timer
    startGame(); // Restart game logic
}

// Event listener for restart button
document.getElementById("restart-button").addEventListener("click", restartGame);

// Start the game when the page loads
window.onload = startGame;

