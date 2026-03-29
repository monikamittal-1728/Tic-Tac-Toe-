# ✨ Tic Tac Toe

A sleek, animated two-player Tic Tac Toe game built with vanilla HTML, CSS, and JavaScript. Features a glassmorphism UI, dynamic star field background, animated blobs, sound effects, and persistent session scores.

---

## 🎮 Features

- **Two-player local multiplayer** — enter custom names for Player X and Player O
- **Scoreboard** — tracks wins and draws across multiple rounds within a session
- **Sound effects** — unique tones for placing X, placing O, winning, drawing, and UI clicks (toggleable)
- **Win/Draw overlay** — animated result card with confetti dots
- **Session persistence** — scores and game state are saved via `sessionStorage` so a page refresh doesn't reset your session
- **Responsive design** — works on mobile and desktop
- **Animated background** — drifting gradient blobs + twinkling star field

---

## 🗂️ Project Structure

```
tic-tac-toe/
├── index.html   # App markup — setup screen, game board, result overlay
├── style.css    # All styling — glassmorphism cards, animations, responsive layout
└── app.js       # Game logic, sound engine, session storage, UI rendering
```

---

## 🚀 Getting Started

No build tools or dependencies required. Just open the project in a browser.

### Option 1 — Open directly
Double-click `index.html` to open it in your default browser.

### Option 2 — Local server (recommended)
```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```
Then visit `http://localhost:8080` in your browser.

---

## 🕹️ How to Play

1. Enter names for **Player X** and **Player O** on the setup screen (defaults to "Player X" / "Player O" if left blank).
2. Click **Let's Play** to start.
3. Players take turns clicking empty cells to place their mark (✕ or ○).
4. The first player to align **3 marks** in a row, column, or diagonal wins the round.
5. If all 9 cells are filled with no winner, the round is a **Draw**.
6. Use **New Round ✨** to play again while keeping scores, or **Reset** to clear all scores.
7. The 🔔 button in the top-right toggles sound on/off.
8. The ‹‹ button returns to the setup screen.

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Markup     | HTML5                               |
| Styling    | CSS3 (custom properties, grid, animations, glassmorphism) |
| Logic      | Vanilla JavaScript (ES6+)           |
| Icons      | Font Awesome 6.5                    |
| Audio      | Web Audio API                       |
| Storage    | `sessionStorage`                    |

---

## 📄 Author

MONIKA MITTAL
