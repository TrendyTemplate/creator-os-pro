import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5sy45EuyUpU3Zs_kkWJkcWykQMHoqyZc",
  authDomain: "creator-content-calendar-d6d00.firebaseapp.com",
  projectId: "creator-content-calendar-d6d00",
  storageBucket: "creator-content-calendar-d6d00.firebasestorage.app",
  messagingSenderId: "4050351310",
  appId: "1:4050351310:web:3d123372754ef1b2330c9f",
  measurementId: "G-XNY2RT5LMM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
