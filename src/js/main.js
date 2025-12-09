/**
 * GDG Pomodoro Timer
 * A simple, beginner-friendly JavaScript application for managing focus sessions.
 * 
 * Concepts covered:
 * - Variables & Constants
 * - DOM Manipulation (finding & changing elements)
 * - Event Listeners (clicks, inputs)
 * - Functions & Logic
 * - setInterval for timing
 */

// ==========================================
// 1. CONFIGURATION & STATE
// Variables that store data for our app
// ==========================================

const DURATIONS = {
  focus: 25 * 60,         // 25 minutes in seconds
  "short-break": 5 * 60,  // 5 minutes
  "long-break": 15 * 60,  // 15 minutes
};

const THEMES = {
  focus: "var(--google-blue)",
  "short-break": "var(--google-green)",
  "long-break": "var(--google-yellow)",
};

// Application State (The "memory" of our app)
let state = {
  mode: "focus",           // Current mode: 'focus', 'short-break', or 'long-break'
  timeLeft: DURATIONS.focus, // Time remaining in seconds
  isRunning: false,        // Is the timer currently counting down?
  timerInterval: null,     // Holds the ID of our active interval (so we can stop it)
  // tasks: [],            // Array to store our list of tasks (Commented out for workshop simplicity)
};

// ==========================================
// 2. DOM ELEMENTS
// We select elements from the HTML page so we can control them
// ==========================================

const elements = {
  // Timer Display
  timerDisplay: document.getElementById("timer-display"),
  timerLabel: document.getElementById("timer-label"),
  ringProgress: document.getElementById("ring-progress"),
  
  // Buttons & Controls
  toggleBtn: document.getElementById("toggle-btn"),
  toggleIcon: document.getElementById("toggle-icon"),
  resetBtn: document.getElementById("reset-btn"),
  modeButtons: document.querySelectorAll("[data-mode]"),
  
  modeButtons: document.querySelectorAll("[data-mode]"),
  
  /* 
  // Tasks (Commented out)
  taskList: document.getElementById("task-list"),
  taskInput: document.getElementById("new-task-title"),
  addTaskBtn: document.getElementById("add-task-btn"),
  taskCount: document.getElementById("task-count-num"), 
  */
};

// ==========================================
// 3. CORE FUNCTIONS 
// The logic that makes the app work
// ==========================================

/**
 * Updates the screen to show the current state.
 * This is called whenever data changes.
 */
function updateUI() {
  // 1. Update the time display (e.g., "25:00")
  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  // PadStart ensures we see "05" instead of just "5"
  elements.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  
  // 2. Update the progress ring circle
  const totalTime = DURATIONS[state.mode];
  const progress = 1 - (state.timeLeft / totalTime);
  elements.ringProgress.style.strokeDashoffset = progress; // logic in CSS handles the drawing

  // 3. Update the play/pause icon
  elements.toggleIcon.textContent = state.isRunning ? "pause" : "play_arrow";

  // 4. Highlight the correct mode button
  elements.modeButtons.forEach(btn => {
    const btnMode = btn.dataset.mode;
    if (btnMode === state.mode) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  /* 
  // 5. Update Task Counts (Commented out)
  const completedTasks = state.tasks.filter(t => t.isDone).length;
  elements.taskCount.textContent = completedTasks;
  */

  // 6. Update Color Theme
  const root = document.documentElement;
  root.style.setProperty("--theme-primary", THEMES[state.mode]);
  
  // 6. Update Timer Label
  if (state.mode === 'focus') {
    elements.timerLabel.textContent = state.isRunning ? "Go go go!" : "Ready to focus?";
  } else {
    elements.timerLabel.textContent = "Take a breather";
  }
}

/**
 * Switches the timer mode (Focus, Short Break, Long Break)
 */
function switchMode(newMode) {
  state.mode = newMode;
  state.timeLeft = DURATIONS[newMode];
  state.isRunning = false;
  
  // Stop the timer if it was running
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  
  updateUI();
}

/**
 * Starts or Pauses the timer
 */
function toggleTimer() {
  // If running, stop it
  if (state.isRunning) {
    state.isRunning = false;
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  } 
  // If stopped, start it
  else {
    state.isRunning = true;
    
    // Create an interval that runs every 1 second (1000ms)
    state.timerInterval = setInterval(() => {
      if (state.timeLeft > 0) {
        state.timeLeft--;
        updateUI();
      } else {
        // Time is up!
        alert("Time is up!");
        state.isRunning = false;
        clearInterval(state.timerInterval);
        switchMode(state.mode === 'focus' ? 'short-break' : 'focus'); // Simple auto-switch
      }
    }, 1000);
  }
  
  updateUI();
}

/**
 * Resets the current timer to the beginning
 */
function resetTimer() {
  state.isRunning = false;
  clearInterval(state.timerInterval);
  state.timerInterval = null;
  state.timeLeft = DURATIONS[state.mode];
  updateUI();
}

/* 
// ==========================================
// 4. TASK MANAGEMENT
// Handling the todo list (Commented out for simplified workshop)
// ==========================================

function addTask() {
  const text = elements.taskInput.value.trim();
  if (text === "") return; // Don't add empty tasks

  const newTask = {
    id: Date.now(), // simple unique ID
    text: text,
    isDone: false
  };

  state.tasks.push(newTask);
  elements.taskInput.value = ""; // Clear input
  renderTasks();
  updateUI();
}

function toggleTask(id) {
  // Find the task and flip its isDone status
  const task = state.tasks.find(t => t.id === id);
  if (task) {
    task.isDone = !task.isDone;
    renderTasks();
    updateUI();
  }
}

function deleteTask(id) {
  // Keep only tasks that do NOT match the ID
  state.tasks = state.tasks.filter(t => t.id !== id);
  renderTasks();
  updateUI();
}

/**
 * Renders the list of tasks into the HTML
 */
/**
function renderTasks() {
  elements.taskList.innerHTML = ""; // Clear current list

  if (state.tasks.length === 0) {
    elements.taskList.innerHTML = '<li class="empty-state">No active tasks</li>';
    return;
  }

  state.tasks.forEach(task => {
    // Create List Item
    const li = document.createElement("li");
    li.className = `task-item ${task.isDone ? "completed" : ""}`;
    
    // HTML for the task
    li.innerHTML = `
      <div class="task-content">
        <button class="btn-check" onclick="window.app.toggleTask(${task.id})">
          <span class="material-symbols-rounded">${task.isDone ? "check_circle" : "radio_button_unchecked"}</span>
        </button>
        <span class="task-title">${task.text}</span>
      </div>
      <button class="btn-delete" onclick="window.app.deleteTask(${task.id})">
        <span class="material-symbols-rounded">delete</span>
      </button>
    `;

    elements.taskList.appendChild(li);
  });
}
*/

// ==========================================
// 5. INITIALIZATION & EVENTS
// Connecting everything together
// ==========================================

// Add click events to buttons
elements.toggleBtn.addEventListener("click", toggleTimer);
elements.resetBtn.addEventListener("click", resetTimer);
/* 
// Task Event Listeners (Commented out)
elements.addTaskBtn.addEventListener("click", addTask);
elements.taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});
*/

// Mode switching buttons
elements.modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    switchMode(btn.dataset.mode);
  });
});

/*
// Expose functions to window (Commented out)
window.app = {
  toggleTask,
  deleteTask
};
*/

// Start the app!
updateUI();
// renderTasks(); // (Commented out)
