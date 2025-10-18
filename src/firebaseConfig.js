// src/lib/firebase.js
// Import from the main Firebase config to ensure consistency
import { app, auth, db, googleProvider, microsoftProvider, checkFirestoreConnection } from '../firebaseConfig';

// Re-export everything
export { app, auth, db, googleProvider, microsoftProvider, checkFirestoreConnection };

// For backward compatibility with any code using getAnalytics
export const analytics = null; // Or initialize analytics if needed
export default app;