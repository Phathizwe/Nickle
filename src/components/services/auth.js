import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      return result.user;
  } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
  }
};

// Sign in with Microsoft
export const signInWithMicrosoft = async () => {
  try {
      const provider = new OAuthProvider('microsoft.com');
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user);
      return result.user;
  } catch (error) {
      console.error('Error signing in with Microsoft:', error);
      throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
      await firebaseSignOut(auth);
  } catch (error) {
      console.error('Error signing out:', error);
      throw error;
  }
};

// Create or update user profile
const createUserProfile = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
      const { email, displayName, photoURL } = user;
      try {
          await setDoc(userRef, {
              email,
              displayName,
              photoURL,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
          });
      } catch (error) {
          console.error('Error creating user profile:', error);
          throw error;
      }
  } else {
      await setDoc(userRef, { updatedAt: serverTimestamp() }, { merge: true });
  }
};

// Get current user session
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          resolve(user);
      }, reject);
  });
};

// Get user profile by userId
export const getUserProfile = async (userId) => {
  try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.data();
  } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
  }
};
