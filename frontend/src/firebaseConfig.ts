// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnof02syBCxCgmUiUXa9Q-GYZ8bHz10r8",
  authDomain: "reactnoti-49496.firebaseapp.com",
  projectId: "reactnoti-49496",
  storageBucket: "reactnoti-49496.firebasestorage.app",
  messagingSenderId: "655409057384",
  appId: "1:655409057384:web:a34111efe2348df25c35dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { app, messaging };
