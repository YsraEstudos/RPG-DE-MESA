// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBJwE3XF4FSPtfP-Wpnl_6c3h94c5t2gwI",
    authDomain: "rpgprimeiroentrenos.firebaseapp.com",
    projectId: "rpgprimeiroentrenos",
    storageBucket: "rpgprimeiroentrenos.firebasestorage.app",
    messagingSenderId: "722702841026",
    appId: "1:722702841026:web:4526043896c52c3ed1775b",
    measurementId: "G-G6ZR2NZQLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
