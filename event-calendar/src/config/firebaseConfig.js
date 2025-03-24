// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_K-NQ2zbY-Xk3jb1IHGRPExx45Y6eRT8",
  authDomain: "eventcalendar-2a6d3.firebaseapp.com",
  projectId: "eventcalendar-2a6d3",
  storageBucket: "eventcalendar-2a6d3.firebasestorage.app",
  messagingSenderId: "209712143196",
  appId: "1:209712143196:web:3feb47b7f8de4391e0ff99",
  measurementId: "G-NZT534HJ1H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
