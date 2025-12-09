# 🎓 GDG Pomodoro: JavaScript Live Coding Script
**Duration:** 1h - 1h 30m  
**Goal:** Build a working Pomodoro timer from scratch (excluding Task CRUD).

---

## 🏁 Phase 0: Setup (5 mins)
*   **Goal:** Ensure everyone has the HTML/CSS ready and connected.
*   **Action:** Open `main.js` (empty) and `index.html`.
*   **Talking Point:** "HTML is the skeleton, CSS is the skin, and JavaScript is the brain. Today we are building the brain."

---

## 🏗️ Phase 1: The "Memory" (State & Config) (10 mins)
*   **Goal:** Define the data our app needs to remember.
*   **Concept:** specific specific variables vs. objects.

### Step 1.1: Configuration
```javascript
// 1. CONFIGURATION
const DURATIONS = {
  focus: 25 * 60,         
  "short-break": 5 * 60,  
  "long-break": 15 * 60, 
};
```
*   *Explain:* specialized objects (Dictionaries) map keys to values. `25 * 60` is easier to read than `1500`.

### Step 1.2: State
```javascript
// 2. STATE
let state = {
  mode: "focus",           
  timeLeft: DURATIONS.focus, 
  isRunning: false,        
  timerInterval: null,   
};
```
*   *Explain:* `state` is the "single source of truth". If the variable changes, the screen *should* change.

---

## 🔌 Phase 2: Connecting the Wires (DOM Selection) (10 mins)
*   **Goal:** Get references to HTML elements so we can control them.
*   **Concept:** `document.getElementById` and `querySelector`.

```javascript
// 3. DOM ELEMENTS
const elements = {
  timerDisplay: document.getElementById("timer-display"),
  toggleBtn: document.getElementById("toggle-btn"),
  toggleIcon: document.getElementById("toggle-icon"), // The play/pause icon
  resetBtn: document.getElementById("reset-btn"),
  modeButtons: document.querySelectorAll("[data-mode]"), // Selects all 3 buttons
};
```
*   *Tip:* Log `elements` to the console to show that they are real HTML nodes.

---

## 🎨 Phase 3: The "Render" Loop (15 mins)
*   **Goal:** Make the screen reflect the `state`. **(Crucial Step)**
*   **Concept:** Data Driven UI.

```javascript
// 4. FUNCTIONS

function updateUI() {
  // Calculated minutes and seconds
  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  
  // Format string: "25:00" using padStart
  elements.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Update Button Icon
  elements.toggleIcon.textContent = state.isRunning ? "pause" : "play_arrow";
}

// Call it once to test!
updateUI();
```
*   *Demo:* Manually change `state.timeLeft = 100` in the code and refresh. See the UI update? That's the power of the render function.

---

## ⏱️ Phase 4: Making it Tick (The Timer) (20 mins)
*   **Goal:** Start reducing `timeLeft` every second.
*   **Concept:** `setInterval` and `clearInterval`.

### Step 4.1: Toggle Logic
```javascript
function toggleTimer() {
  if (state.isRunning) {
    // STOP LOGIC
    state.isRunning = false;
    clearInterval(state.timerInterval);
  } else {
    // START LOGIC
    state.isRunning = true;
    
    state.timerInterval = setInterval(() => {
      if (state.timeLeft > 0) {
        state.timeLeft--;
        updateUI(); // Don't forget to update the screen!
      } else {
        // Time's up!
        clearInterval(state.timerInterval);
        state.isRunning = false;
        alert("Time is up!");
        updateUI();
      }
    }, 1000); // 1000ms = 1 second
  }
  updateUI();
}
```

### Step 4.2: Hook up the Event Listener
```javascript
// 5. EVENTS
elements.toggleBtn.addEventListener("click", toggleTimer);
```
*   *Test:* Click the play button. Is it counting down? Click it again. Does it pause?

---

## 🎛️ Phase 5: Controls (Modes & Reset) (15 mins)
*   **Goal:** Allow switching between Focus and Breaks.
*   **Concept:** Reusing logic.

### Step 5.1: Reset
```javascript
function resetTimer() {
  state.isRunning = false;
  clearInterval(state.timerInterval);
  state.timeLeft = DURATIONS[state.mode]; // Reset to current mode's max time
  updateUI();
}

elements.resetBtn.addEventListener("click", resetTimer);
```

### Step 5.2: Switching Modes
```javascript
function switchMode(newMode) {
  state.mode = newMode;
  state.timeLeft = DURATIONS[newMode];
  // Reuse reset logic effectively
  resetTimer();
  
  // OPTIONAL: Update active button visual
  elements.modeButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === newMode);
  });
}

// Add listeners to chips
elements.modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode; // Read from HTML data-mode="..."
    switchMode(mode);
  });
});
```

---

## 🚀 Phase 6: Wrap up & Q/A (10 mins)
*   Recap: We separated State (Data) from UI (View).
*   Challenge for students: "Can you change the colors when the mode changes?" (Hint: It's just adding a class or setting a CSS variable in `switchMode`).
