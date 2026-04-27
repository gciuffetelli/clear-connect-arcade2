const { useState } = React;
const { motion } = window.framerMotion;

// ── Sounds ──────────────────────────────────────
const sounds = {
  click: new Audio("./sounds/button-click.mp3"),
  correct: new Audio("./sounds/power-up.mp3"),
  wrong: new Audio("./sounds/error-buzz.mp3"),
  win: new Audio("./sounds/level-complete.mp3"),
};

Object.values(sounds).forEach(s => (s.volume = 0.6));

// ── Scenarios ───────────────────────────────────
const scenarios = [
  {
    prompt: "🕹️ SCENE 1: Whole-class instruction",
    question: "Which CLEAR Connect mode should you choose?",
    options: [
      { text: "Tethered Mode", correct: true },
      { text: "Untethered Mode", correct: false },
    ],
    correct: "✅ POWER UP! Tethered mode supports moving instruction.",
    wrong: "❌ GAME OVER! Untethered works best when stationary.",
  },
  {
    prompt: "👾 FINAL BOSS: Mid-lesson access issues",
    question: "What is the best response?",
    options: [
      {
        text:
          "Pause instruction, fix access issues, resume at a slower pace",
        correct: true,
      },
      { text: "Ignore issues and keep teaching", correct: false },
    ],
    correct:
      "👑 FINAL BOSS DEFEATED! You prioritized access and pacing.",
    wrong:
      "💀 BOSS WINS! Effective use means addressing access immediately.",
  },
];

// ── Game Component ──────────────────────────────
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
      animate: { opacity: [0.95, 1, 0.98, 1] },
      transition: { duration: 0.4 },
    },
    React.createElement(
      motion.div,
      {
        animate: isFinalBoss && !feedback
          ? { x: [0, -6, 6, -6, 6, 0] }
          : {},
        transition: { duration: 0.4 },
        style: {
          border: "2px solid #00ff88",
          boxShadow: "0 0 20px #00ff88",
          padding: "2rem",
          maxWidth: "540px",
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

// ── Render ──────────────────────────────────────
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(RetroClearConnectGame));
