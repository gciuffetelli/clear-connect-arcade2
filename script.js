const { useState } = React;
const { motion } = window.framerMotion;

// ── Sound Effects ───────────────────────────────
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
    prompt: "🕹️ SCENE 1: Whole‑class instruction",
    question: "Which CLEAR Connect mode should you use?",
    options: [
      { text: "Tethered Mode", correct: true },
      { text: "Untethered Mode", correct: false },
    ],
    correct: "✅ POWER UP! Tethered mode supports mobility.",
    wrong: "❌ GAME OVER! Untethered works best when stationary.",
  },
  {
    prompt: "👾 FINAL BOSS: Mid‑lesson access chaos",
    question: "What’s the best response?",
    options: [
      {
        text: "Pause, fix access issues, resume at a slower pace",
        correct: true,
      },
      { text: "Ignore issues and continue teaching", correct: false },
    ],
    correct: "👑 FINAL BOSS DEFEATED!",
    wrong: "💀 Boss wins — access comes first.",
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
