/* ============================================
   THEME TOGGLE
   ============================================ */
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// load saved theme
const savedTheme = localStorage.getItem('xo_theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('xo_theme', next);
});

/* ============================================
   GAME STATE
   ============================================ */
let board         = Array(9).fill('');
let currentPlayer = 'X';
let gameOver      = false;
let vsAI          = true;

let scores = {
  X: parseInt(localStorage.getItem('xo_x') || '0'),
  O: parseInt(localStorage.getItem('xo_o') || '0')
};

/* ============================================
   ELEMENTS
   ============================================ */
const cells        = document.querySelectorAll('.cell');
const statusText   = document.getElementById('statusText');
const scoreXEl     = document.getElementById('scoreX');
const scoreOEl     = document.getElementById('scoreO');
const xLabel       = document.getElementById('xLabel');
const oLabel       = document.getElementById('oLabel');
const overlay      = document.getElementById('overlay');
const overlayEmoji = document.getElementById('overlayEmoji');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMsg   = document.getElementById('overlayMsg');
const btnNew       = document.getElementById('btnNew');
const btnReset     = document.getElementById('btnReset');
const btnVsAI      = document.getElementById('btnVsAI');
const btnVsHuman   = document.getElementById('btnVsHuman');
const btnOverlay   = document.getElementById('btnOverlayClose');

// Win combinations
const WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

/* ============================================
   INIT
   ============================================ */
updateScoreUI();
updateStatus();

/* ============================================
   MODE SWITCH
   ============================================ */
btnVsAI.addEventListener('click', () => {
  if (vsAI) return;
  vsAI = true;
  btnVsAI.classList.add('active');
  btnVsHuman.classList.remove('active');
  xLabel.textContent = 'X — أنت';
  oLabel.textContent = 'O — كمبيوتر';
  newGame();
});

btnVsHuman.addEventListener('click', () => {
  if (!vsAI) return;
  vsAI = false;
  btnVsHuman.classList.add('active');
  btnVsAI.classList.remove('active');
  xLabel.textContent = 'X — لاعب 1';
  oLabel.textContent = 'O — لاعب 2';
  newGame();
});

/* ============================================
   CELL CLICKS
   ============================================ */
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const i = parseInt(cell.dataset.i);
    if (gameOver || board[i]) return;
    if (vsAI && currentPlayer === 'O') return;

    makeMove(i, currentPlayer);

    if (!gameOver && vsAI && currentPlayer === 'O') {
      updateStatus(); // show "بيفكر"
      setTimeout(aiMove, 420);
    }
  });
});

/* ============================================
   MAKE MOVE
   ============================================ */
function makeMove(i, player) {
  board[i] = player;
  const cell = cells[i];
  cell.textContent = player;
  cell.classList.add(player === 'X' ? 'x-cell' : 'o-cell', 'taken');

  const winner = checkWinner(board);
  if (winner) {
    highlightWin(winner.combo);
    scores[winner.player]++;
    updateScoreUI();
    gameOver = true;

    const isPlayerX = winner.player === 'X';
    const isAI      = vsAI && winner.player === 'O';

    setTimeout(() => {
      showOverlay(
        isAI    ? '🤖' : '🏆',
        isAI    ? 'الكمبيوتر كسب!' : (vsAI ? 'فزت!' : `اللاعب ${winner.player} فاز!`),
        isAI    ? 'جرب تاني وهتكسبه 💪' : 'أنت الأحسن! 🎉'
      );
    }, 450);

  } else if (board.every(v => v)) {
    gameOver = true;
    setTimeout(() => showOverlay('🤝', 'تعادل!', 'الجولة الجاية هتكون أحسن'), 220);

  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
  }
}

/* ============================================
   AI — MINIMAX (unbeatable)
   ============================================ */
function aiMove() {
  if (gameOver) return;
  const result = minimax([...board], 'O', 0);
  makeMove(result.index, 'O');
}

function minimax(b, player, depth) {
  const w = winnerOf(b);
  if (w === 'X') return { score: depth - 10 };
  if (w === 'O') return { score: 10 - depth  };

  const empty = b.reduce((acc, v, i) => v === '' ? [...acc, i] : acc, []);
  if (empty.length === 0) return { score: 0 };

  const isMax = player === 'O';
  let best = { score: isMax ? -Infinity : Infinity, index: -1 };

  for (const i of empty) {
    b[i] = player;
    const res = minimax([...b], player === 'O' ? 'X' : 'O', depth + 1);
    b[i] = '';
    if (isMax ? res.score > best.score : res.score < best.score) {
      best = { score: res.score, index: i };
    }
  }
  return best;
}

function winnerOf(b) {
  for (const [a, c, d] of WINS) {
    if (b[a] && b[a] === b[c] && b[c] === b[d]) return b[a];
  }
  return null;
}

/* ============================================
   CHECK WINNER (live board)
   ============================================ */
function checkWinner(b) {
  for (const combo of WINS) {
    const [a, c, d] = combo;
    if (b[a] && b[a] === b[c] && b[c] === b[d]) {
      return { player: b[a], combo };
    }
  }
  return null;
}

function highlightWin(combo) {
  combo.forEach(i => cells[i].classList.add('win-cell'));
}

/* ============================================
   STATUS
   ============================================ */
function updateStatus() {
  if (gameOver) return;

  if (vsAI) {
    if (currentPlayer === 'X') {
      statusText.innerHTML = `دورك — أنت <span class="x-turn">X</span>`;
    } else {
      statusText.innerHTML = `🤖 الكمبيوتر بيفكر...`;
    }
  } else {
    if (currentPlayer === 'X') {
      statusText.innerHTML = `دور اللاعب <span class="x-turn">X</span>`;
    } else {
      statusText.innerHTML = `دور اللاعب <span class="o-turn">O</span>`;
    }
  }
}

/* ============================================
   SCORE UI
   ============================================ */
function updateScoreUI() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  localStorage.setItem('xo_x', scores.X);
  localStorage.setItem('xo_o', scores.O);
}

/* ============================================
   OVERLAY
   ============================================ */
function showOverlay(emoji, title, msg) {
  overlayEmoji.textContent = emoji;
  overlayTitle.textContent = title;
  overlayMsg.textContent   = msg;
  overlay.classList.add('show');
}

/* ============================================
   NEW GAME / RESET
   ============================================ */
function newGame() {
  board         = Array(9).fill('');
  currentPlayer = 'X';
  gameOver      = false;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.className   = 'cell';
  });

  overlay.classList.remove('show');
  updateStatus();
}

btnNew.addEventListener('click', newGame);
btnOverlay.addEventListener('click', newGame);

btnReset.addEventListener('click', () => {
  scores = { X: 0, O: 0 };
  updateScoreUI();
  newGame();
});
