// ==========================================
// CodeSage — Dashboard Mentor Logic (v0.2)
// ==========================================

// 1. SELECT DOM ELEMENTS
const codeInput = document.querySelector("#code-input");
const languageSelect = document.querySelector("#language-select");
const analyzeBtn = document.querySelector("#analyze-btn");
const hintBtn = document.querySelector("#hint-btn");
const mentorMessage = document.querySelector("#mentor-message");
const hintsContainer = document.querySelector("#hints-container");
const statusText = document.querySelector("#status-text");
const statusDot = document.querySelector("#status-dot");

// 2. STATE & SAMPLE DATA
// List of progressive hints stored in an array
const hints = [
    "Start by identifying what the loop is trying to accomplish.",
    "Check the condition of your loop carefully.",
    "Think about what happens at the boundary value."
];

// Track how many hints have been revealed to the user
let currentHintIndex = 0;

// Track whether code has been analyzed
let isCodeAnalyzed = false;

// 3. HELPER FUNCTIONS

// Update the bottom status bar text and indicator styling
function updateStatus(message, state) {
    statusText.textContent = message;
    
    // Reset dot classes and apply appropriate state class
    statusDot.className = "status-dot";
    if (state === "active") {
        statusDot.classList.add("active");
    } else if (state === "warning") {
        statusDot.classList.add("warning");
    }
}

// Clear all rendered hint cards from the UI
function resetHints() {
    hintsContainer.innerHTML = "";
    currentHintIndex = 0;
}

// 4. CORE FEATURE FUNCTIONS

// Handles the code analysis flow
function analyzeCode() {
    const userCode = codeInput.value.trim();
    const selectedLanguage = languageSelect.value;

    // Check if the user left the editor empty
    if (userCode === "") {
        mentorMessage.textContent = "Please enter some code in the editor before requesting an analysis.";
        updateStatus("No code detected. Please write or paste code.", "warning");
        isCodeAnalyzed = false;
        resetHints();
        return;
    }

    // Code is present — display simulated mentor analysis
    mentorMessage.textContent = "Code received. I've analyzed your attempt.";
    updateStatus(`Ready with feedback for ${selectedLanguage.toUpperCase()} code. Click 'Get Hint' to begin.`, "active");
    
    // Mark as analyzed and reset hints for the new submission
    isCodeAnalyzed = true;
    resetHints();
}

// Handles the progressive hint delivery
function getNextHint() {
    // Check if user has analyzed code first
    if (!isCodeAnalyzed) {
        mentorMessage.textContent = "Please click 'Analyze Code' first so I can inspect your code before giving hints.";
        updateStatus("Analysis needed before hints can be provided.", "warning");
        return;
    }

    // Check if we still have unrevealed hints in the array
    if (currentHintIndex < hints.length) {
        const hintNumber = currentHintIndex + 1;
        const hintContent = hints[currentHintIndex];

        // Create a new hint card element dynamically
        const hintCard = document.createElement("div");
        hintCard.className = "hint-card";

        // Create the hint title badge
        const hintTitle = document.createElement("div");
        hintTitle.className = "hint-title";
        hintTitle.textContent = `💡 Hint ${hintNumber}`;

        // Create the hint description text
        const hintText = document.createElement("p");
        hintText.className = "hint-text";
        hintText.textContent = hintContent;

        // Append title and text to the hint card
        hintCard.appendChild(hintTitle);
        hintCard.appendChild(hintText);

        // Add the hint card into the hints container in the DOM
        hintsContainer.appendChild(hintCard);

        // Move to the next hint index
        currentHintIndex = currentHintIndex + 1;

        // Update the status bar with current progress
        updateStatus(`Revealed hint ${currentHintIndex} of ${hints.length}.`, "active");
    } else {
        // All hints have already been displayed
        updateStatus("All hints for this problem have been revealed.", "active");
    }
}

// 5. EVENT LISTENERS
analyzeBtn.addEventListener("click", analyzeCode);
hintBtn.addEventListener("click", getNextHint);
