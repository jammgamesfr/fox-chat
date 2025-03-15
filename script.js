let startButton = document.getElementById('startButton');
let stopButton = document.getElementById('stopButton');
let timerDisplay = document.getElementById('timerDisplay');
let businessNameInput = document.getElementById('businessName');

let timer;
let minutes = 0;
let seconds = 0;
let isRunning = false;

startButton.addEventListener('click', () => {
    if (businessNameInput.value.trim() === '') {
        alert('Please enter a business name!');
        return;
    }

    if (!isRunning) {
        isRunning = true;
        startButton.disabled = true;
        stopButton.disabled = false;
        
        timer = setInterval(updateTimer, 1000);
    }
});

stopButton.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    startButton.disabled = false;
    stopButton.disabled = true;
    
    const businessName = businessNameInput.value.trim();
    timerDisplay.textContent = `${formatTime(minutes, seconds)} - ${businessName} talk stopped`;
});

function updateTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }

    const businessName = businessNameInput.value.trim();
    timerDisplay.textContent = `${formatTime(minutes, seconds)} - ${businessName}`;
}

function formatTime(minutes, seconds) {
    const min = minutes < 10 ? `0${minutes}` : minutes;
    const sec = seconds < 10 ? `0${seconds}` : seconds;
    return `${min}:${sec}`;
}
