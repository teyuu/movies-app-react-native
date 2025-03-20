import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import AsyncStorage from '@react-native-async-storage/async-storage';




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBThDwQqJVhhuqTkN3cjgYb7YzOOLiQRBY",
  authDomain: "moviesapp-react-native.firebaseapp.com",
  projectId: "moviesapp-react-native",
  storageBucket: "moviesapp-react-native.firebasestorage.app",
  messagingSenderId: "659095356978",
  appId: "1:659095356978:web:b2f5d9feb247997f8d9e2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(app); 
export const FIREBASE_AUTH = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});