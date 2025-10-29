// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcitracqgFqisP7RiB-LWRSTrW1uCntVQ",
  authDomain: "sulaiman-3833f.firebaseapp.com",
  projectId: "sulaiman-3833f",
  storageBucket: "sulaiman-3833f.firebasestorage.app",
  messagingSenderId: "84849495645",
  appId: "1:84849495645:web:d67be2793a4539a16107b4",
  measurementId: "G-0FW0H5EJJY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Ensure auth state persists across reloads and deployments
setPersistence(auth, browserLocalPersistence).catch(() => {
  // Non-fatal: fall back to default persistence if the browser blocks it
});

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
const db = getFirestore(app);
export { app, analytics, auth, provider, db };
