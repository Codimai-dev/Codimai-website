// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

import { ENV } from './env.js';

const firebaseConfig = {
  apiKey: ENV?.FIREBASE_API_KEY || '',
  authDomain: ENV?.FIREBASE_AUTH_DOMAIN || '',
  projectId: ENV?.FIREBASE_PROJECT_ID || '',
  storageBucket: ENV?.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: ENV?.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: ENV?.FIREBASE_APP_ID || ''
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
