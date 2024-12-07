
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAIozOpaSH_7yg2mrsMEjxoQBjx3WUcPDA",
  authDomain: "e-commerce-3d40c.firebaseapp.com",
  projectId: "e-commerce-3d40c",
  storageBucket: "e-commerce-3d40c.firebasestorage.app",
  messagingSenderId: "493645487828",
  appId: "1:493645487828:web:b47dbd0541f6b6db69a541",
  measurementId: "G-L1X3STEWJ5"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getAuth(app);