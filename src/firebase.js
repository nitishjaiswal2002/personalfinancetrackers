import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCG8RQbnmkCzAe28w0zUDFb9E99T_gV9eM",
  authDomain: "financly-personal-finance.firebaseapp.com",
  projectId: "financly-personal-finance",
  storageBucket: "financly-personal-finance.appspot.com",
  messagingSenderId: "593800466949",
  appId: "1:593800466949:web:567976d00b98a0c15e826c",
  measurementId: "G-07SG1PZWST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, analytics, db, auth, provider, doc, setDoc };