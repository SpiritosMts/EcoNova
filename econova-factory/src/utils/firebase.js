// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyApwtIMP9T5Fk_JefQHxtQzRi3I1HyJ7VM",
  authDomain: "econova-962d3.firebaseapp.com",
  databaseURL: "https://econova-962d3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "econova-962d3",
  storageBucket: "econova-962d3.firebasestorage.app",
  messagingSenderId: "34581652072",
  appId: "1:34581652072:web:dc50338fdd8b85182b9b0",
  measurementId: "G-0L0GY8L7CH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const firestore = getFirestore(app);

console.log('Firebase initialized successfully');

export { auth, db, firestore };
export const useMockAuth = false;
