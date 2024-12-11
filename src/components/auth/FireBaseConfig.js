import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIozOpaSH_7yg2mrsMEjxoQBjx3WUcPDA",
  authDomain: "e-commerce-3d40c.firebaseapp.com",
  projectId: "e-commerce-3d40c",
  storageBucket: "e-commerce-3d40c.firebasestorage.app",
  messagingSenderId: "493645487828",
  appId: "1:493645487828:web:b47dbd0541f6b6db69a541",
  measurementId: "G-L1X3STEWJ5",
  databaseURL: "https://e-commerce-3d40c-default-rtdb.firebaseio.com/", // Add Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Initialize Authentication
export const auth = getAuth(app);



// Initialize Realtime Database
export const database = getDatabase(app);

export const storage =getStorage(app);
