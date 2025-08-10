import { initializeApp } from 'firebase/app';
import { getAuth }      from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA9MUa0-ZrfDpaPb7e764q2W6YRpsRWZd4",
  authDomain: "videoshare-client.firebaseapp.com",
  projectId: "videoshare-client",
  storageBucket: "videoshare-client.firebasestorage.app",
  messagingSenderId: "468909200601",
  appId: "1:468909200601:web:3ec637c7d11e41a5369ac8",
  measurementId: "G-YL0HDTBEV5"
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
