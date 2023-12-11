import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCB6G3qSA5pQ6EVf-RKMrBq9VObUs2A5R4",
  authDomain: "duet-portal.firebaseapp.com",
  projectId: "duet-portal",
  storageBucket: "duet-portal.appspot.com",
  messagingSenderId: "962726459074",
  appId: "1:962726459074:web:d422593d76de5938faed5b",
  measurementId: "G-MP8YQM83NB",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
