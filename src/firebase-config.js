// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, collection, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDR2XQHw9XEv1SIZZY1Fb5-AZ6xSRtyHUs",
  authDomain: "nickle-aeab7.firebaseapp.com",
  projectId: "nickle-aeab7",
  storageBucket: "nickle-aeab7.appspot.com",
  messagingSenderId: "144695166233",
  appId: "1:144695166233:web:903dc7824e77f9820e3188",
  measurementId: "G-RVJECMNYJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with offline persistence
export const db = getFirestore(app);

// Enable offline persistence with better error handling
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.warn('Multiple tabs open, persistence disabled');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.warn('Browser doesn\'t support persistence');
    } else {
      // Log other errors but don't show a toast
      console.error('Persistence error:', err);
    }
});

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure Microsoft Auth Provider
export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  prompt: 'select_account'
});

// Helper function to check connection status
export const checkFirestoreConnection = async () => {
  try {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );
    
    const healthRef = doc(collection(db, '_health'), 'test');
    const testDoc = await Promise.race([
      getDoc(healthRef),
      timeout
    ]);
    
    return true;
  } catch (error) {
    console.error('Firestore connection error:', error);
    return false;
  }
};

// For backward compatibility with any code using analytics
export const analytics = {
  logEvent: () => {} // No-op function for environments where analytics isn't available
};

export default app;