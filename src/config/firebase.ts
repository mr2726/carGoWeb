import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBDno0UDPJukZy-qxEL9RDT1fi2sQwBIgM",
  authDomain: "cargo-2c492.firebaseapp.com",
  projectId: "cargo-2c492",
  storageBucket: "cargo-2c492.firebasestorage.app",
  messagingSenderId: "257721101922",
  appId: "1:257721101922:web:0639c9e755eeaec27b6b3b"
};

console.log('Initializing Firebase with config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

console.log('Firebase initialized successfully'); 