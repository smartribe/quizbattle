import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { db } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database-compact";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDPUYlUhOa_JfIFX38RIbH84H_S-yVVdNA",
  authDomain: "quizbattle-24ba2.firebaseapp.com",
  projectId: "quizbattle-24ba2",
  storageBucket: "quizbattle-24ba2.firebasestorage.app",
  messagingSenderId: "28658796585",
  appId: "1:28658796585:web:6abbc29bb98616c5867438",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = firebaseConfig.database();

//====================================
// Global Variables
//====================================
let playerName = "";
let roomId = "";
let currentQuestionIndex = 1;
let timerInterval;

//====================================
// Create Room
//====================================
function createRoom() {
  playerName = document.getElementById("playerName").value.trim();
  (roomId = getElementById("roomId").value.trim() || Math),
    random().toString(36).substring(2, 8).toUpperCase();

  if (!playerName) {
    alert("Please enter your name.");
    return;
  }

  // Create room in Firebase
  db.ref("rooms/" + roomId).set({
    currentQuestion: 1,
    players: {
      player1: { name: playerName, score: 0 },
    },
    questions: {
      1: {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: 2,
      },
      2: {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: 1,
      },
      3: {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: 2,
      },
    },
  });
  joinRoom(); // Auto Join to room after creating
  //====================================
  // Join Room
  //====================================
  function joinRoom() {
    playerName = document.getElementById("playerName").value.trim();
    roomId = document.getElementById("roomId").value.trim();

    if (!playerName || !roomId) {
      alert("Please enter your name and room ID.");
      return;
    }

    //Add player to room in Firebase
    db.ref(`rooms/${roomId}/players/${playerName}`).set({ score: 0 });

    //Switch UI to game screen
    document.getElementById("lobby").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("roomTitle").innerText = "Room " + roomId;

    // Listen for game state changes
    listenForGameState();
  }

  //====================================
  // Listen for Game State Changes
  //====================================
  function listenForGameState() {
    db.ref("rooms/" + roomId).on("value", (snapshot) => {
      const roomData = snapshot.val();
      if (!roomData) {
        alert("Room does not exist.");
        location.reload();
        return;
      }
      //Show Scoreboard
      const question = roomData.questions[roomData.currentQuestion];
      if (question) {
        showQuestion(question);

        //update scores
        const players = roomData.players || {};
        const scoreBoard = document.getElementById("scoreBoard");
        scoreBoard.innerHTML = "";

        for (const player in players) {
          let li = document.createElement("li");
          li.innerText = `${players[player].name}: ${players[player].score}`;
          scoreBoard.appendChild(li);
        }

        //If all questions answered, end game
        if (roomData.currentQuestion > Object.keys(roomData.questions).length) {
          endGame(players);
        }
      }
    });
  }
}
