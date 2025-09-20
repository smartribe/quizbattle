import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
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

const auth = getAuth(app);

// Sign in Function
function signIn(email, password) {
  const user = signInWithEmailAndPassword(auth, email, password);
  console.log(user);

  return user;
}

document.getElementById("loginButton").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signIn(email, password);
});
//Monitor user authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;

    document.getElementById("status").innerText = `Logged in as: ${user.email}`;
    window.location.href = "index.html";
  } else {
    console.log("No user is signed in.");
    document.getElementById("status").innerText = "Not logged in";
  }
});
