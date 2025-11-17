// src/lib/firebase.js
// Import everything from our consolidated Firebase config file
import app, { 
  auth, 
  db, 
  functions,
  googleProvider, 
  microsoftProvider, 
  checkFirestoreConnection,
  analytics
} from '../firebase-config';

// Re-export everything
export { 
  app, 
  auth, 
  db, 
  functions,
  googleProvider, 
  microsoftProvider, 
  checkFirestoreConnection,
  analytics
};

export default app;