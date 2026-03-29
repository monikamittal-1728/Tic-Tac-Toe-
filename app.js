let gameData = {
  X: "Player X",
  O: "Player O",
  scoreX: 0,
  scoreO: 0,
  draw: 0,
  playing: false,
};

document.getElementById("startButton").addEventListener("click", startGame);

// ── STARS ──
(function () {
  const el = document.getElementById("stars");
  for (let i = 0; i < 80; i++) {
    const s = document.createElement("div");
    s.className = "star";
    const size = Math.random() * 2 + 0.5;
    s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random() * 100}%;left:${Math.random() * 100}%;animation-duration:${2 + Math.random() * 4}s;animation-delay:-${Math.random() * 5}s;`;
    el.appendChild(s);
  }
})();

const cellElement = document.querySelectorAll(".cell");
const statusLabel = document.getElementById("status");
const overlay = document.getElementById("overlay");
const rHead = document.getElementById("rHead");
const rSub = document.getElementById("rSub");
const xBoxCard = document.getElementById("cX");
const oBoxCard = document.getElementById("cO");

let turn_X = true;
let gameOver = false;

// ── SOUND ENGINE ──
let audioCtx = null;
let soundEnabled = true;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone({ type = "sine", frequency = 440, duration = 0.15, gainPeak = 0.4, delay = 0 } = {}) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.05);
  } catch (e) {}
}

function soundPlaceX() { playTone({ type: "square",   frequency: 600, duration: 0.08, gainPeak: 0.18 }); }
function soundPlaceO() { playTone({ type: "sine",     frequency: 320, duration: 0.12, gainPeak: 0.25 }); }
function soundWin()    {
  playTone({ type: "triangle", frequency: 523, duration: 0.18, gainPeak: 0.35, delay: 0.0  });
  playTone({ type: "triangle", frequency: 659, duration: 0.18, gainPeak: 0.35, delay: 0.18 });
  playTone({ type: "triangle", frequency: 784, duration: 0.35, gainPeak: 0.45, delay: 0.36 });
}
function soundDraw()   {
  playTone({ type: "sine", frequency: 370, duration: 0.18, gainPeak: 0.25, delay: 0.0 });
  playTone({ type: "sine", frequency: 330, duration: 0.25, gainPeak: 0.2,  delay: 0.2 });
}
function soundClick()  { playTone({ type: "sine", frequency: 480, duration: 0.07, gainPeak: 0.15 }); }

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById("sndBtn");
  btn.innerHTML = soundEnabled
    ? '<i class="fa-solid fa-bell"></i>'
    : '<i class="fa-solid fa-bell-slash"></i>';
}

// ── GAME LOGIC ──
window.onload = function () {
  let data = JSON.parse(sessionStorage.getItem("game_data") || "null");
  if (data && data.playing) {
    gameData = data;
    document.getElementById("setup").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
    newRound();
  } else {
    document.getElementById("setup").classList.remove("hidden");
    document.getElementById("game").classList.add("hidden");
  }
};

for (let cell of cellElement) {
  cell.addEventListener("click", handleClick);
}

function newRound() {
  turn_X = true;
  gameOver = false;
  oBoxCard.classList.remove("on");
  xBoxCard.classList.add("on");
  for (let cell of cellElement) {
    cell.classList.remove("mx", "mo", "placed", "taken");
    cell.innerHTML = "";
  }
  handlePlayerTurn(turn_X);
  renderGameUI(gameData);
}

function handleClick(e) {
  if (gameOver) return;

  // FIX: e.target may be the <i> icon inside the cell — always resolve to the .cell parent
  const clickedCell = e.target.closest(".cell");
  if (!clickedCell) return;
  if (clickedCell.classList.contains("taken")) return;

  let currentClass = turn_X ? "mx" : "mo";
  let currentElementTag = turn_X
    ? '<i class="fa-solid fa-xmark mx"></i>'
    : '<i class="fa-regular fa-circle mo"></i>';

  turn_X ? soundPlaceX() : soundPlaceO();

  clickedCell.classList.add(currentClass, "placed", "taken");
  clickedCell.innerHTML = currentElementTag;

  // Also add pointer-events:none to the icon so it can never be e.target again
  const icon = clickedCell.querySelector("i");
  if (icon) icon.style.pointerEvents = "none";

  if (checkWin(currentClass)) {
    gameOver = true;
    soundWin();
    recordWinner(currentClass);
    return;
  }

  if (drawGame()) {
    gameOver = true;
    soundDraw();
    handleDraw();
    return;
  }

  turn_X = !turn_X;
  handleScoreCard(turn_X);
  handlePlayerTurn(turn_X);
}

function handleDraw() {
  gameData.draw++;
  updateSessionData();
  renderGameUI(gameData);
  overlay.classList.remove("hidden");
  rHead.innerHTML = "Match Draw!";
  rSub.innerHTML = "";
}

function recordWinner(winner) {
  let winner_name = winner === "mx" ? gameData.X : gameData.O;
  if (winner === "mx") {
    gameData.scoreX++;
    rSub.innerHTML = `${gameData.X} has ${gameData.scoreX} win(s)!`;
  } else {
    gameData.scoreO++;
    rSub.innerHTML = `${gameData.O} has ${gameData.scoreO} win(s)!`;
  }
  updateSessionData();
  renderGameUI(gameData);
  overlay.classList.remove("hidden");
  rHead.innerHTML = winner_name + " is the Winner! 🎉";
}

function handlePlayerTurn(turn_X) {
  statusLabel.innerHTML = turn_X ? `${gameData.X}'s turn` : `${gameData.O}'s turn`;
}

function handleScoreCard(turn_X) {
  if (turn_X) {
    oBoxCard.classList.remove("on");
    xBoxCard.classList.add("on");
  } else {
    xBoxCard.classList.remove("on");
    oBoxCard.classList.add("on");
  }
}

const WINNING_COMBO = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWin(currentClass) {
  return WINNING_COMBO.some((row) =>
    row.every((i) => cellElement[i].classList.contains(currentClass))
  );
}

function drawGame() {
  return [...cellElement].every(
    (cell) => cell.classList.contains("mx") || cell.classList.contains("mo")
  );
}

function closeOverlay() {
  soundClick();
  document.getElementById("overlay").classList.add("hidden");
}

function goBack() {
  soundClick();
  gameData.playing = false;
  updateSessionData();
  document.getElementById("game").classList.add("hidden");
  document.getElementById("setup").classList.remove("hidden");
}

function resetScores() {
  soundClick();
  gameData.scoreX = 0;
  gameData.scoreO = 0;
  gameData.draw = 0;
  updateSessionData();
  newRound();
}

function startGame() {
  soundClick();
  gameData.X = document.getElementById("npx").value.trim() || "Player X";
  gameData.O = document.getElementById("npo").value.trim() || "Player O";
  gameData.scoreX = 0;
  gameData.scoreO = 0;
  gameData.draw = 0;
  gameData.playing = true;
  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
    // ── Clear inputs ──
  document.getElementById("npx").value = "";
  document.getElementById("npo").value = "";
  updateSessionData();
  newRound();
}

function renderGameUI(gameData) {
  document.getElementById("dX").innerText = gameData.X;
  document.getElementById("dO").innerText = gameData.O;
  document.getElementById("sX").innerHTML = gameData.scoreX;
  document.getElementById("sO").innerHTML = gameData.scoreO;
  document.getElementById("sD").innerHTML = gameData.draw;
}

function updateSessionData() {
  sessionStorage.setItem("game_data", JSON.stringify(gameData));
}