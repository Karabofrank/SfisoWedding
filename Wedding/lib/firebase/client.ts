import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// A thin wrapper that initializes the Firebase client SDK in the browser.
// Used only if you need to talk to Firestore/Storage from client components.

// Wedding/lib/firebase/config.ts

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: "G-0MJHRYSSS7" // As seen in your Firebase console
};

export function getFirebaseApp() {
  if (!getApps().length) {
    initializeApp(firebaseConfig as any);
  }
  return getApp();
}

export const clientDb = getFirestore(getFirebaseApp());
export const clientStorage = getStorage(getFirebaseApp());
