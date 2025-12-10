// ==========================================
// 1. VARIABLES & CONFIGURATION
// ==========================================

// Time durations in seconds
const FOCUS_TIME = 25 * 60;
const SHORT_BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

// Colors
const COLOR_BLUE = "var(--google-blue)";
const COLOR_GREEN = "var(--google-green)";
const COLOR_YELLOW = "var(--google-yellow)";

// State variables (Global)
let timeLeft = FOCUS_TIME;
let isRunning = false;
let currentMode = "focus"; // 'focus', 'short-break', 'long-break'
let timerInterval = null;


// ==========================================
// 2. DOM ELEMENTS (Selecting by ID)
// ==========================================

const timerDisplay = document.getElementById("timer-display");
const timerLabel = document.getElementById("timer-label");
const ringProgress = document.getElementById("ring-progress");

// Buttons
const startBtn = document.getElementById("toggle-btn");
const resetBtn = document.getElementById("reset-btn");
const toggleIcon = document.getElementById("toggle-icon");

// Mode Buttons
const focusBtn = document.getElementById("focus-btn");
const shortBreakBtn = document.getElementById("short-break-btn");
const longBreakBtn = document.getElementById("long-break-btn");



// ==========================================
// 3. TIMER FUNCTIONS
// ==========================================

function updateTimerDisplay() {
  // Calculate minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Format as "MM:SS" (e.g., "05:09")
  const formattedTime =
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  timerDisplay.textContent = formattedTime;

  // Update the ring progress
  let totalTime = FOCUS_TIME;
  if (currentMode === "short-break") totalTime = SHORT_BREAK_TIME;
  if (currentMode === "long-break") totalTime = LONG_BREAK_TIME;

  const progress = 1 - timeLeft / totalTime;
  ringProgress.style.strokeDashoffset = progress;
}

function startTimer() {
  if (isRunning) {
    // If already running, pause it
    clearInterval(timerInterval);
    isRunning = false;
    toggleIcon.textContent = "play_arrow";
    timerLabel.textContent = "Paused";
    console.log("Timer Paused");
  } else {
    // Start the timer
    isRunning = true;
    toggleIcon.textContent = "pause";
    timerLabel.textContent =
      currentMode === "focus" ? "Stay focused" : "Take a break";

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft = timeLeft - 1;
        console.log("Timer Running");
        updateTimerDisplay();
      } else {
        // Timer finished
        clearInterval(timerInterval);
        isRunning = false;
        toggleIcon.textContent = "play_arrow";
        alert("Time is up!");
        console.log("TImer Finished");
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  toggleIcon.textContent = "play_arrow";
  console.log("Timer Reset");
  // Reset time based on current mode
  if (currentMode === "focus") timeLeft = FOCUS_TIME;
  else if (currentMode === "short-break") timeLeft = SHORT_BREAK_TIME;
  else if (currentMode === "long-break") timeLeft = LONG_BREAK_TIME;

  updateTimerDisplay();
}

function setMode(mode) {
  currentMode = mode;

  // Update buttons style
  focusBtn.classList.remove("active");
  shortBreakBtn.classList.remove("active");
  longBreakBtn.classList.remove("active");

  const root = document.documentElement;
  console.log(root);

  if (mode === "focus") {
    timeLeft = FOCUS_TIME;
    focusBtn.classList.add("active");
    root.style.setProperty("--theme-primary", COLOR_BLUE);
    timerLabel.textContent = "Ready to focus?";
    console.log("Focus Mode");
  } else if (mode === "short-break") {
    timeLeft = SHORT_BREAK_TIME;
    shortBreakBtn.classList.add("active");
    root.style.setProperty("--theme-primary", COLOR_GREEN);
    timerLabel.textContent = "Time for a break";
    console.log("Short Break Mode");
  } else if (mode === "long-break") {
    timeLeft = LONG_BREAK_TIME;
    longBreakBtn.classList.add("active");
    root.style.setProperty("--theme-primary", COLOR_YELLOW);
    timerLabel.textContent = "Time for a long break";
    console.log("Long Break Mode");
  }

  // Stop timer when switching modes
  clearInterval(timerInterval);
  isRunning = false;
  toggleIcon.textContent = "play_arrow";
  console.log("Timer Reset");

  updateTimerDisplay();
}



// ==========================================
// 5. EVENT LISTENERS
// ==========================================

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

focusBtn.addEventListener("click", () => {
  setMode("focus");
  console.log("Focus mode activated");
});

shortBreakBtn.addEventListener("click", () => {
  setMode("short-break");
  console.log("Short break mode activated");
});

longBreakBtn.addEventListener("click", () => {
  setMode("long-break");
  console.log("Long break mode activated");
});



// Initialize
updateTimerDisplay();

