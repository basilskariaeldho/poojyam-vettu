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