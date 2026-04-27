/* ======================================
   CLEAR CONNECT RETRO ARCADE GAME
   GitHub Pages–Safe | No Build Step Required
====================================== */

const { useState } = React;

/* ---------- Sound Effects (graceful fallback if files missing) ---------- */
function makeSound(src) {
  try {
    const a = new Audio(src);
    a.volume = 0.6;
    return a;
  } catch (e) {
    return { play: () => {}, currentTime: 0 };
  }
}

const sounds = {
  click:   makeSound("./sounds/button-click.mp3"),
  correct: makeSound("./sounds/power-up.mp3"),
  wrong:   makeSound("./sounds/error-buzz.mp3"),
  win:     makeSound("./sounds/level-complete.mp3"),
};

function play(sound) {
  try {
    sound.currentTime = 0;
    sound.play().catch(() => {}); // suppress uncaught promise errors
  } catch (e) {}
}

/* ---------- CSS injected at runtime (no external deps needed) ---------- */
const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: 'Press Start 2P', monospace;
  }

  @keyframes crt-flicker {
    0%, 100% { opacity: 1; }
    92%       { opacity: 0.97; }
    94%       { opacity: 1; }
    96%       { opacity: 0.95; }
    98%       { opacity: 1; }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    15%       { transform: translateX(-6px); }
    30%       { transform: translateX(6px); }
    45%       { transform: translateX(-6px); }
    60%       { transform: translateX(6px); }
    75%       { transform: translateX(-3px); }
    90%       { transform: translateX(3px); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse-border {
    0%, 100% { box-shadow: 0 0 18px #00ff88, 0 0 4px #00ff88 inset; }
    50%       { box-shadow: 0 0 32px #00ff88, 0 0 10px #00ff88 inset; }
  }

  .arcade-wrapper {
    animation: crt-flicker 4s infinite;
    width: 90%;
    max-width: 640px;
  }

  .arcade-card {
    border: 2px solid #00ff88;
    animation: pulse-border 2.5s ease-in-out infinite;
    padding: 2rem;
    color: #00ff88;
    background: #000;
    position: relative;
  }

  .arcade-card.boss {
    animation: pulse-border 2.5s ease-in-out infinite,
               shake 0.5s ease-in-out;
    border-color: #ff4444;
    color: #ff4444;
    box-shadow: 0 0 28px #ff4444;
  }

  .scene-label {
    font-size: 0.65rem;
    margin-bottom: 1.2rem;
    letter-spacing: 0.05em;
    opacity: 0.8;
  }

  .scene-question {
    font-size: 0.72rem;
    line-height: 1.8;
    margin-bottom: 1.6rem;
  }

  .score-bar {
    font-size: 0.6rem;
    text-align: right;
    margin-bottom: 1rem;
    opacity: 0.7;
    letter-spacing: 0.1em;
  }

  .option-btn {
    display: block;
    width: 100%;
    margin: 0.5rem 0;
    padding: 0.75rem 0.9rem;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.62rem;
    font-weight: bold;
    background: #00ff88;
    color: #000;
    border: none;
    cursor: pointer;
    text-align: left;
    line-height: 1.6;
    transition: background 0.15s, color 0.15s, transform 0.1s;
  }

  .option-btn:hover {
    background: #000;
    color: #00ff88;
    outline: 2px solid #00ff88;
    transform: translateX(4px);
  }

  .arcade-card.boss .option-btn {
    background: #ff4444;
    color: #000;
  }

  .arcade-card.boss .option-btn:hover {
    background: #000;
    color: #ff4444;
    outline: 2px solid #ff4444;
  }

  .feedback {
    animation: fadeIn 0.3s ease-out;
    font-size: 0.68rem;
    line-height: 1.9;
    margin-top: 0.5rem;
  }

  .next-btn {
    margin-top: 1.2rem;
    padding: 0.65rem 1.3rem;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.62rem;
    font-weight: bold;
    background: #00ff88;
    color: #000;
    border: none;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .next-btn:hover {
    background: #000;
    color: #00ff88;
    outline: 2px solid #00ff88;
  }

  .final-score {
    margin-top: 1.2rem;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
  }

  .progress-bar-track {
    width: 100%;
    height: 6px;
    background: #002211;
    margin-bottom: 1.2rem;
    border: 1px solid #00ff88;
  }

  .progress-bar-fill {
    height: 100%;
    background: #00ff88;
    transition: width 0.4s ease;
  }
`;
document.head.appendChild(style);

/* ---------- Game Scenarios ---------- */
const scenarios = [
  {
    prompt: "🕹️ SCENE 1: Whole-class instruction",
    question:
      "You are moving around the room while teaching. Students need live translation.",
    options: [
      { text: "Tethered Mode", correct: true },
      { text: "Untethered Mode", correct: false },
    ],
    correct: "✅ POWER UP! Tethered mode supports hands-free whole-group instruction.",
    wrong:   "❌ GAME OVER! Untethered mode is better for stationary use.",
    boss: false,
  },
  {
    prompt: "🕹️ BONUS STAGE: Students see text but hear no audio",
    question: "What should you check FIRST?",
    options: [
      { text: "Student device volume / headphones", correct: true },
      { text: "Restart the CLEAR Connect session",   correct: false },
      { text: "Switch operating modes",              correct: false },
    ],
    correct: "🔊 SOUND RESTORED! Always start with basic audio checks.",
    wrong:   "⚠️ WRONG MOVE! Try the simplest fix before restarting.",
    boss: false,
  },
  {
    prompt: "👾 FINAL BOSS: Mid-lesson access chaos",
    question:
      "Two students can't hear audio, one joined in the wrong language, and the class is restless. What's BEST?",
    options: [
      {
        text: "Pause instruction, fix access and language settings, resume at a slower pace",
        correct: true,
      },
      {
        text: "Ignore the issues and continue teaching",
        correct: false,
      },
    ],
    correct: "👑 FINAL BOSS DEFEATED! Access, clarity, and pacing come first.",
    wrong:   "💀 Boss wins. Multilingual learners must understand to engage.",
    boss: true,
  },
];

/* ---------- Game Component ---------- */
function RetroClearConnectArcade() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [feedback,   setFeedback]   = useState("");
  const [score,      setScore]      = useState(0);

  const scene       = scenarios[sceneIndex];
  const isFinalBoss = scene.boss;
  const isLast      = sceneIndex === scenarios.length - 1;
  const progress    = ((sceneIndex) / scenarios.length) * 100;

  return React.createElement(
    "div", { className: "arcade-wrapper" },

    React.createElement(
      "div", { className: `arcade-card${isFinalBoss ? " boss" : ""}` },

      /* Score + progress */
      React.createElement("div", { className: "score-bar" }, `SCORE: ${score}`),
      React.createElement(
        "div", { className: "progress-bar-track" },
        React.createElement("div", {
          className: "progress-bar-fill",
          style: { width: `${progress}%` },
        })
      ),

      /* Scene label */
      React.createElement("p", { className: "scene-label" }, scene.prompt),

      /* Question */
      React.createElement("p", { className: "scene-question" }, scene.question),

      /* Answer buttons (hidden once answered) */
      !feedback &&
        scene.options.map((opt, i) =>
          React.createElement(
            "button",
            {
              key: i,
              className: "option-btn",
              onClick: () => {
                play(sounds.click);
                if (opt.correct) {
                  play(sounds.correct);
                  setScore(s => s + 100);
                  setFeedback(scene.correct);
                } else {
                  play(sounds.wrong);
                  setFeedback(scene.wrong);
                }
              },
            },
            opt.text
          )
        ),

      /* Feedback block */
      feedback &&
        React.createElement(
          "div", { className: "feedback" },
          React.createElement("p", null, feedback),

          /* Next Level button */
          !isLast &&
            React.createElement(
              "button",
              {
                className: "next-btn",
                onClick: () => {
                  play(sounds.win);
                  setFeedback("");
                  setSceneIndex(i => i + 1);
                },
              },
              "▶ NEXT LEVEL"
            ),

          /* Final score */
          isLast &&
            React.createElement(
              "p", { className: "final-score" },
              `🏁 FINAL SCORE: ${score + (feedback === scene.correct ? 0 : 0)}`
            )
        )
    )
  );
}

/* ---------- Render (supports React 17 + 18) ---------- */
const rootEl = document.getElementById("root");

if (ReactDOM.createRoot) {
  // React 18
  ReactDOM.createRoot(rootEl).render(
    React.createElement(RetroClearConnectArcade)
  );
} else {
  // React 17 fallback
  ReactDOM.render(React.createElement(RetroClearConnectArcade), rootEl);
}
