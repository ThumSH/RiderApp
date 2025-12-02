import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey:EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyDOfShcM4Uu9b72BvusWJDRX7Oep02NFbA,
  authDomain: "skk-20.firebaseapp.com",
  projectId: "skk-20",
  storageBucket: "skk-20.firebasestorage.app",
  messagingSenderId: "34850578117",
  appId: "1:34850578117:web:a535289cd92d2ef5ed9aac"
};

// Singleton Pattern
let app;
let auth;

if (getApps().length === 0) {
  // 1. Initialize App
  app = initializeApp(firebaseConfig);

  // 2. Initialize Auth with Persistence (Fixes the warning)
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} else {
  // Reloading (Hot Reload)
  app = getApp();
  // We use getAuth() here because it's already initialized
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };