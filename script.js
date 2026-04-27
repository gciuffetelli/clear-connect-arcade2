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
    prompt: "🕹️ SCENE 1: You are teaching a whole-class lesson and moving around the room.",
    question: "Which CLEAR Connect mode should you select?",
    options: [
      { text: "Tethered Mode", correct: true },
      { text: "Untethered Mode", correct: false },
    ],
    correct: "✅ POWER UP! Tethered mode supports hands-free instruction.",
    wrong: "❌ GAME OVER! Untethered is better for stationary use.",
  },
  {
    prompt: "🕹️ SCENE 2: A student joins your CLEAR Connect session.",
    question: "What must the student do next?",
    options: [
      { text: "Select their preferred language", correct: true },
      { text: "Rename the session", correct: false },
      { text: "Turn off device audio", correct: false },
    ],
    correct: "✅ LEVEL UP! Language selection is required.",
    wrong: "❌ INSERT COIN! The student must choose a language.",
  },
  {
    prompt: "👾 FINAL BOSS: Multiple students need help mid-lesson.",
    question: "What is the best response?",
    options: [
      {
        text: "Pause instruction, fix access issues, resume at a slower pace",
        correct: true,
      },
      { text: "Ignore the issues and continue", correct: false },
      { text: "Restart the session later", correct: false },
    ],
    correct:
      "👑 BOSS DEFEATED! You stabilized access and supported all learners.",
    wrong:
      "💀 BOSS WINS! Effective use means addressing access immediately.",
  },
];

// ── App Component ───────────────────────────────
function RetroClearConnectGame() {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);

  const scene = scenarios[index];
  const isFinalBoss = index === scenarios.length - 1;

  function play(sound) {
