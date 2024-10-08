
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCa1j6T3wdBMDhhQ6VivW7tnoGNQVKPsGQ",
  authDomain: "needle-assign.firebaseapp.com",
  projectId: "needle-assign",
  storageBucket: "needle-assign.appspot.com",
  messagingSenderId: "1061792769607",
  appId: "1:1061792769607:web:e91b94b6d038973bf4f362",
  measurementId: "G-EMZF5BQHEY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)
export { auth, db };