// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_5VyGtq8MZbVOE6NDxMu_N0iT-omFszo",
  authDomain: "matrix-130-live-sub-tracker.firebaseapp.com",
  projectId: "matrix-130-live-sub-tracker",
  storageBucket: "matrix-130-live-sub-tracker.appspot.com",
  messagingSenderId: "744441548382",
  appId: "1:744441548382:web:c264a773565b6915fdaecf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
export default app 