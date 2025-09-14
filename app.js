// =========================
// 1. Firebase Setup (Modular SDK)
// =========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  update,
  onValue,
  get,
  child,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

//  web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDPUYlUhOa_JfIFX38RIbH84H_S-yVVdNA",
  authDomain: "quizbattle-24ba2.firebaseapp.com",
  databaseURL:
    "https://quizbattle-24ba2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quizbattle-24ba2",
  storageBucket: "quizbattle-24ba2.firebasestorage.app",
  messagingSenderId: "28658796585",
  appId: "1:28658796585:web:6abbc29bb98616c5867438",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// -------------------
// GAME STATE
// -------------------
let currentRoomId = "";
let username = "";
let score = 0;
let currentQuestion = 0;

const questions = [
  { q: "What is 2 + 2?", options: ["3", "4", "5"], answer: "4" },
  {
    q: "Capital of France?",
    options: ["London", "Paris", "Berlin"],
    answer: "Paris",
  },
  {
    q: "HTML stands for?",
    options: [
      "HyperText Markup Language",
      "Home Tool Markup Language",
      "Hot Mail",
    ],
    answer: "HyperText Markup Language",
  },
  {
    q: "CSS is used for?",
    options: ["Styling", "Database", "Networking"],
    answer: "Styling",
  },
  { q: "What is 5 x 6?", options: ["30", "20", "25"], answer: "30" },
];

// -------------------
// ROOM FUNCTIONS
// -------------------
function generateRoomId() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

export function createRoom() {
  username = document.getElementById("username").value.trim();
  if (!username) return alert("Enter your name first!");

  currentRoomId = generateRoomId();

  set(ref(db, "rooms/" + currentRoomId), {
    players: {},
  });

  alert("Room Created! Share this Room ID: " + currentRoomId);
  startQuiz();
}

export function joinRoom() {
  username = document.getElementById("username").value.trim();
  currentRoomId = document.getElementById("roomId").value.trim();
  if (!username || !currentRoomId) return alert("Enter your name and room ID!");

  startQuiz();
}

// -------------------
// QUIZ FUNCTIONS
// -------------------
function startQuiz() {
  document.getElementById("lobby").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  document.getElementById("scoreboard").style.display = "block";
  score = 0;
  currentQuestion = 0;
  showQuestion();
  listenToLeaderboard(currentRoomId);
}

function showQuestion() {
  if (currentQuestion >= questions.length) {
    endQuiz();
    return;
  }
  const q = questions[currentQuestion];
  document.getElementById("question").textContent = q.q;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(opt, q.answer);
    answersDiv.appendChild(btn);
  });
  document.getElementById("nextBtn").style.display = "none";
}

function selectAnswer(choice, correct) {
  if (choice === correct) score++;
  document.getElementById("nextBtn").style.display = "block";
}

function nextQuestion() {
  currentQuestion++;
  showQuestion();
}

function endQuiz() {
  // Save score to Firebase under this player
  update(ref(db, "rooms/" + currentRoomId + "/players"), {
    [username]: { score: score },
  });

  document.getElementById("quiz").style.display = "none";
}

// -------------------
// LEADERBOARD
// -------------------
function listenToLeaderboard(roomId) {
  const playersRef = ref(db, "rooms/" + roomId + "/players");

  onValue(playersRef, (snapshot) => {
    const players = snapshot.val() || {};
    const sorted = Object.entries(players).sort(
      (a, b) => b[1].score - a[1].score
    );

    let table =
      "<h2>🏆 Leaderboard</h2><table><tr><th>Rank</th><th>Name</th><th>Score</th></tr>";
    sorted.forEach(([name, data], i) => {
      table += `<tr><td>${i + 1}</td><td>${name}</td><td>${
        data.score
      }</td></tr>`;
    });
    table += "</table>";

    document.getElementById("scoreboard").innerHTML = table;
  });
}
// Expose functions to HTML
window.createRoom = createRoom;
window.joinRoom = joinRoom;
window.nextQuestion = nextQuestion;
// =========================
// End of app.js
// =========================
