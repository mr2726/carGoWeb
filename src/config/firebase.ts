import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBHQs62p57TluiLgYjvDKpZpIQ8uIjwxUE",
  authDomain: "cargo-d6454.firebaseapp.com",
  projectId: "cargo-d6454",
  storageBucket: "cargo-d6454.firebasestorage.app",
  messagingSenderId: "296878766453",
  appId: "1:296878766453:web:6e6226b83f5337bc757b3c"
};

// Commenting out console.log statements
// console.log('Initializing Firebase with config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// console.log('Firebase initialized successfully');