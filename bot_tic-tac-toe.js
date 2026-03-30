import "./styles.css";

// --- 1. SETUP & HTML GENERATION ---
document.getElementById("app").innerHTML = `
<div class="header">
  <h2>Tic Tac Toe</h2>
  <div id="status">Your Turn (X)</div>
  <button id="resetBtn" style="display:none; margin-top:10px;">Play Again</button>
</div>
<div class="box"></div>
`;

const box = document.querySelector(".box");
const statusDisplay = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

// Create 9 blocks
for (let i = 0; i < 9; i++) {
  const div = document.createElement("div");
  div.classList = "block";
  div.id = i.toString(); // IDs 0-8 for easier array mapping
  box.appendChild(div);
}

// --- 2. GAME STATE (The "Brain") ---
// We use a clean array instead of reading the DOM
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
const HUMAN = "X";
const AI = "O";

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const scores = {
  X: -10, // Human Wins (Bad)
  O: 10,  // AI Wins (Good)
  tie: 0
};

// --- 3. CORE LOGIC HELPERS ---

// Returns 'X', 'O', 'tie', or null (if game continues)
function checkResult(currentBoard) {
  // Check Winner
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
      return currentBoard[a];
    }
  }
  // Check Tie
  if (!currentBoard.includes("")) {
    return "tie";
  }
  return null;
}

function handleGameOver(result) {
  gameActive = false;
  resetBtn.style.display = "block";
  if (result === "tie") {
    statusDisplay.innerText = "It's a Draw!";
  } else {
    statusDisplay.innerText = result === AI ? "AI Wins! (Unbeatable)" : "You Win!";
  }
}

// --- 4. THE AI (MINIMAX WITH ALPHA-BETA PRUNING) ---

function minimax(boardState, depth, isMaximizing, alpha, beta) {
  let result = checkResult(boardState);
  
  // Base Case: Terminal State
  if (result !== null) {
    // Optimization: Prefer winning sooner (subtract depth)
    return result === AI ? (10 - depth) : result === HUMAN ? (depth - 10) : 0;
  }

  if (isMaximizing) { // AI's Turn
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = AI;
        let score = minimax(boardState, depth + 1, false, alpha, beta);
        boardState[i] = ""; // Undo
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break; // Pruning
      }
    }
    return bestScore;
  } else { // Human's Turn
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === "") {
        boardState[i] = HUMAN;
        let score = minimax(boardState, depth + 1, true, alpha, beta);
        boardState[i] = ""; // Undo
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break; // Pruning
      }
    }
    return bestScore;
  }
}

function makeAiMove() {
  let bestScore = -Infinity;
  let move = null;

  // Find the best spot
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = AI;
      let score = minimax(board, 0, false, -Infinity, Infinity);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  // Execute the move
  if (move !== null) {
    board[move] = AI;
    document.getElementById(move.toString()).innerText = AI;
    
    // Check if AI won
    const result = checkResult(board);
    if (result) {
      handleGameOver(result);
    } else {
      statusDisplay.innerText = "Your Turn (X)";
    }
  }
}

// --- 5. EVENT LISTENERS (INTERACTION) ---

const blocks = document.querySelectorAll(".block");

blocks.forEach((el) => {
  el.addEventListener("click", () => {
    // Guard Clauses: Prevent cheating or clicking used spots
    if (!gameActive || el.innerText !== "") return;

    // 1. Human Move
    const id = parseInt(el.id);
    board[id] = HUMAN;
    el.innerText = HUMAN;

    // 2. Check Result
    const result = checkResult(board);
    if (result) {
      handleGameOver(result);
      return;
    }

    // 3. AI Move (with small delay for realism)
    statusDisplay.innerText = "AI is thinking...";
    setTimeout(() => {
      if (gameActive) makeAiMove();
    }, 300);
  });
});

// Reset Handler
resetBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  document.querySelectorAll(".block").forEach(b => b.innerText = "");
  statusDisplay.innerText = "Your Turn (X)";
  resetBtn.style.display = "none";
});