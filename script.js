/* ======================================
   CLEAR CONNECT RETRO ARCADE GAME
   GitHub Pages–Safe | Canvas‑Ready
====================================== */

const { useState } = React;
const { motion } = window.framerMotion;

/* ---------- Sound Effects ---------- */
const sounds = {
  click: new Audio("./sounds/button-click.mp3"),
  correct: new Audio("./sounds/power-up.mp3"),
  wrong: new Audio("./sounds/error-buzz.mp3"),
  win: new Audio("./sounds/level-complete.mp3"),
};

// Keep PD‑friendly volume
Object.values(sounds).forEach(s => (s.volume = 0.6));

/* ---------- Game Scenarios ---------- */
const scenarios = [
  {
    prompt: "🕹️ SCENE 1: Whole‑class instruction",
    question: "You are moving around the room while teaching. Students need live translation.",
    options: [
      { text: "Tethered Mode", correct: true },
      { text: "Untethered Mode", correct: false },
    ],
    correct: "✅ POWER UP! Tethered mode supports hands‑free whole‑group instruction.",
    wrong: "❌ GAME OVER! Untethered mode is better for stationary use.",
  },
  {
    prompt: "🕹️ BONUS STAGE: Students see text but hear no audio",
    question: "What should you check FIRST?",
    options: [
      { text: "Student device volume / headphones", correct: true },
      { text: "Restart the CLEAR Connect session", correct: false },
      { text: "Switch operating modes", correct: false },
    ],
    correct: "🔊 SOUND RESTORED! Always start with basic audio checks.",
    wrong: "⚠️ WRONG MOVE! Try the simplest fix before restarting.",
  },
  {
    prompt: "👾 FINAL BOSS: Mid‑lesson access chaos",
    question: "Two students can’t hear audio, one joined in the wrong language, and the class is restless. What’s BEST?",
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
    wrong: "💀 Boss wins. Multilingual learners must understand to engage.",
  },
];

/* ---------- Game Component ---------- */
function RetroClearConnectArcade() {
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
        fontFamily: "monospace",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      // CRT flicker
      animate: { opacity: [0.96, 1, 0.98, 1] },
      transition: { duration: 0.35 },
    },
    React.createElement(
      motion.div,
      {
        // Final Boss screen shake
        animate: isFinalBoss && !feedback ? { x: [0, -6, 6, -6, 6, 0] } : {},
        transition: { duration: 0.4 },
        style: {
          border: "2px solid #00ff88",
          boxShadow: "0 0 20px #00ff88",
          padding: "2rem",
          width: "90%",
          maxWidth: "620px",
        },
      },

      React.createElement("h2", null, scene.prompt),
      React.createElement("p", null, scene.question),

      /* ---------- Answer Buttons ---------- */
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

      /* ---------- Feedback / Progress ---------- */
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
                  padding: "0.6rem 1.2rem",
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

/* ---------- Render Game ---------- */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(RetroClearConnectArcade));
