import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../firebase-config';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  // Add the missing fetchSubscriptionStatus function
  const fetchSubscriptionStatus = async (userId) => {
    try {
      if (!userId) return null;
      
      const subscriptionDoc = await getDoc(doc(db, 'subscriptions', userId));
      return subscriptionDoc.exists() ? subscriptionDoc.data() : null;
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Fetch subscription status
        const sub = await fetchSubscriptionStatus(user.uid);
        setSubscription(sub);
      } else {
        setUser(null);
        setSubscription(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithMicrosoft = async () => {
    const provider = new OAuthProvider('microsoft.com');
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Microsoft:', error);
      throw error;
    }
  };

  const signOut = () => auth.signOut();

  const value = {
    user,
    subscription,
    signInWithGoogle,
    signInWithMicrosoft,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);