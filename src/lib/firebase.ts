// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJZVAjhjlpscka6o8aBZrqfoGskDDcirA",
  authDomain: "kapalin-1cb37.firebaseapp.com",
  projectId: "kapalin-1cb37",
  storageBucket: "kapalin-1cb37.firebasestorage.app",
  messagingSenderId: "922586336875",
  appId: "1:922586336875:web:c4cfbaa6453fb77de16b2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
