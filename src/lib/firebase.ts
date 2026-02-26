import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Robust check to see if Firebase is actually ready to be used
export const isFirebaseConfigured = Boolean(
  firebaseConfig.projectId && 
  typeof firebaseConfig.projectId === 'string' &&
  firebaseConfig.projectId.length > 5 &&
  !firebaseConfig.projectId.includes("replace_with")
);

let app: FirebaseApp;
let db: Firestore;

// Using a standard "safe" dummy config for local mode
const dummyConfig = {
  apiKey: "dummy-key",
  authDomain: "dummy.firebaseapp.com",
  projectId: "dummy-project-id",
  storageBucket: "dummy.appspot.com",
  messagingSenderId: "0000000000",
  appId: "1:000:web:000"
};

try {
  if (getApps().length > 0) {
    app = getApp();
  } else {
    // Only initialize with real config if it's valid, otherwise use dummy
    app = initializeApp(isFirebaseConfigured ? firebaseConfig : dummyConfig);
  }
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization skipped or failed. Falling back to Local Mode.");
  // Provide a safe proxy object that won't crash when accessed
  db = { type: 'local-proxy' } as any;
}

export { app, db };
