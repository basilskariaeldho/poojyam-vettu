// Poojyam Vettu — Firebase connection

const firebaseConfig = {
    apiKey: "AIzaSyCoG-Xerl3S7_bLjacV8-Ux9QBtcBS6_8c",
    authDomain: "poojyam-vettu-897c4.firebaseapp.com",
    databaseURL: "https://poojyam-vettu-897c4-default-rtdb.firebaseio.com",
    projectId: "poojyam-vettu-897c4",
    storageBucket: "poojyam-vettu-897c4.firebasestorage.app",
    messagingSenderId: "215972912806",
    appId: "1:215972912806:web:35b90adce5efa0557bde67"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const auth = firebase.auth();

console.log("Firebase initialized");
// Poojyam Vettu: Firebase connection test

auth.onAuthStateChanged(function (user) {
    if (user) {
        console.log("Firebase connected. Guest ID:", user.uid);
    } else {
        auth.signInAnonymously().catch(function (error) {
            console.error("Firebase guest sign-in failed:", error.code, error.message);
        });
    }
});

database.ref(".info/connected").on("value", function (snapshot) {
    console.log("Realtime Database connected:", snapshot.val());
});
// Show Firebase status on the page
const statusBox = document.createElement("div");

statusBox.style.cssText =
    "position:fixed;bottom:10px;left:10px;right:10px;" +
    "padding:10px;background:#222;color:white;" +
    "font:14px Arial;border-radius:8px;z-index:9999;";

statusBox.textContent = "Checking Firebase...";
document.body.appendChild(statusBox);

auth.onAuthStateChanged(function (user) {
    if (user) {
        statusBox.textContent =
            "✅ Firebase connected — guest signed in";
    } else {
        statusBox.textContent =
            "⏳ Waiting for guest sign-in...";
    }
});

database.ref(".info/connected").on("value", function (snapshot) {
    if (snapshot.val() === true) {
        statusBox.textContent =
            "✅ Realtime Database connected";
    } else {
        statusBox.textContent =
            "⏳ Connecting to Realtime Database...";
    }
});
auth.onAuthStateChanged(function (user) {
    if (user) {
        console.log("Firebase connected. Guest ID:", user.uid);
    } else {
        auth.signInAnonymously().catch(function (error) {
            console.error("Firebase guest sign-in failed:", error.code, error.message);
        });
    }
});