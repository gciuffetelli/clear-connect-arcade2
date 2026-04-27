const { useState } = React;
const { motion } = window.framerMotion;

/* =========================
   Sound Effects
========================= */
const sounds = {
  click: new Audio("./sounds/button-click.mp3"),
  correct: new Audio("./sounds/power-up.mp3"),
  wrong: new Audio("./sounds/error-buzz.mp3"),
  win: new Audio("./sounds/level-complete.mp3"),
};

Object.values(sounds).forEach(s => (s.volume = 0.6));

/* =========================
   Scenarios
========================= */
const scenarios = [
  {
    prompt: "🕹️ SCENE 1: Whole‑class instruction",
    question: "Which CLEAR Connect mode should you use?",
    options: [
      { text: "Tethered Mode", correct: true },
      { text: "Untethered Mode", correct: false },
    ],
    correct: "✅ POWER UP! Tethered mode supports movement during instruction.",
    wrong: "❌ GAME OVER! Untethered works best when stationary.",
  },
  {
    prompt: "🕹️ BONUS STAGE: Students see text but hear no audio",
    question: "What should you check first?",
    options: [
      { text: "Student device volume / headphones", correct: true },
      { text: "Restart the CLEAR Connect session", correct: false },
      { text: "Change modes", correct: false },
    ],
    correct: "🔊 SOUND RESTORED! Always start with basic audio checks.",
    wrong: "⚠️ WRONG MOVE! Try the simplest fix first.",
  },
  {
    prompt: "👾 FINAL BOSS: Multiple access issues mid‑lesson",
    question: "What is the BEST response?",
    options: [
      {
        text: "Pause instruction, fix access, resume at a slower pace",
        correct: true,
      },
      { text: "Ignore issues and continue teaching", correct: false },
    ],
    correct: "👑 FINAL BOSS DEFEATED! Access and pacing come first.",
    wrong: "💀 Boss wins — students must understand to learn.",
  },
];

/* =========================
   Game Component
========================= */
function RetroClearConnectGame() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  const scene = scenarios[sceneIndex];
  const isFinalBoss = sceneIndex === scenarios.length - 1;

  function play(sound) {
    sound.currentTime = 0;
    sound.play();
  }

  return React.createElement(
    motion.div,
    {
      style: {
        minHeight: "100vh",
        background: "black",
        color: "#00ff88",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
      },
      animate: { opacity: [0.96, 1, 0.98, 1] }, // CRT flicker
      transition: { duration: 0.35 },
    },
    React.createElement(
      motion.div,
      {
        animate:
          isFinalBoss && !feedback
            ? { x: [0, -6, 6, -6, 6, 0] } // boss shake
            : {},
        transition: { duration: 0.4 },
        style: {
          border: "2px solid #00ff88",
          boxShadow: "0 0 20px #00ff88",
          padding: "2rem",
          maxWidth: "600px",
          width: "90%",
        },
      },
      React.createElement("h2", null, scene.prompt),
      React.createElement("p", null, scene.question),

      !feedback &&
        scene.options.map((opt, i) =>
          React.createElement(
            "button",
            {
              key: i,
              onClick: () => {
                play(sounds.click);
                if (opt.correct) {
                  play(sounds.correct);
                  setScore(score + 100);
                  setFeedback(scene.correct);
                } else {
                  play(sounds.wrong);
                  setFeedback(scene.wrong);
                }
              },
              style: {
                display: "block",
                width: "100%",
                margin: "0.5rem 0",
                padding: "0.6rem",
                fontWeight: "bold",
                background: "#00ff88",
                border: "none",
                cursor: "pointer",
              },
            },
            opt.text
          )
        ),

      feedback &&
        React.createElement(
          "div",
          null,
          React.createElement("p", null, feedback),
          sceneIndex < scenarios.length - 1 &&
            React.createElement(
              "button",
              {
                onClick: () => {
                  play(sounds.win);
                  setFeedback("");
                  setSceneIndex(sceneIndex + 1);
                },
                style: {
                  marginTop: "1rem",
                  padding: "0.6rem 1rem",
                  fontWeight: "bold",
                  background: "#00ff88",
                  border: "none",
                },
              },
              "▶ NEXT LEVEL"
            ),
          sceneIndex === scenarios.length - 1 &&
            React.createElement(
              "p",
              { style: { marginTop: "1rem" } },
              `🏁 FINAL SCORE: ${score}`
            )
        )
    )
  );
}

/* =========================
   Render
========================= */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(RetroClearConnectGame));
``
