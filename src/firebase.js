import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB-YOUR_API_KEY",
  authDomain: "arctreasure-testnet.firebaseapp.com",
  projectId: "arctreasure-testnet",
  storageBucket: "arctreasure-testnet.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
