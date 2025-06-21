
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, TwitterAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBhB8EIwLpAN0T5L8YZpxJQuHxsuc5JRzY",
  authDomain: "dsagame-3ef0b.firebaseapp.com",
  projectId: "dsagame-3ef0b",
  storageBucket: "dsagame-3ef0b.firebasestorage.app",
  messagingSenderId: "746214862424",
  appId: "1:746214862424:web:2632acac357e45d388a42d",
  measurementId: "G-ZKMT58DP6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const twitterProvider = new TwitterAuthProvider();
export const githubProvider = new GithubAuthProvider();

export default app;
