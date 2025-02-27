import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB3urGmhZ8cl8QUCALKyMNjGmXQJd469Lw",
  authDomain: "bop-questions.firebaseapp.com",
  projectId: "bop-questions",
  storageBucket: "bop-questions.firebasestorage.app",
  messagingSenderId: "141354452137",
  appId: "1:141354452137:web:d92cf434797cf531f955b8"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);