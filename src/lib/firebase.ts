import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, set, serverTimestamp } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC9bOvsgKDAIRwpvo1HODnFB6EOwUITopo",
  authDomain: "moodtrack-fd869.firebaseapp.com",
  databaseURL: "https://moodtrack-fd869-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "moodtrack-fd869",
  storageBucket: "moodtrack-fd869.firebasestorage.app",
  messagingSenderId: "880897379142",
  appId: "1:880897379142:web:a3db285ff5148abeeef347",
  measurementId: "G-H46LHGKXS2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Initialize user data structure when they first sign up
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const userRef = ref(db, `users/${user.uid}`);
    try {
      // Check if user data exists first
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        // Only initialize if data doesn't exist
        await set(userRef, {
          email: user.email,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          journal: {} // Initialize empty journal
        });
      } else {
        // Update last login time
        await set(ref(db, `users/${user.uid}/lastLogin`), serverTimestamp());
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  }
});