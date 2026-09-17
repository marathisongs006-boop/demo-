import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB5xamh-zeyWN8g9NeSu1pFpIB2kop-uLU",
  authDomain: "vinayak006-1a9fb.firebaseapp.com",
  projectId: "vinayak006-1a9fb",
  storageBucket: "vinayak006-1a9fb.firebasestorage.app",
  messagingSenderId: "437698568842",
  appId: "1:437698568842:web:8426908dfb4cf256b10373"
};

// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// AUTHORIZED ADMIN UIDS
export const AUTHORIZED_ADMIN_UIDS = [
  "n66vwcTu3OZVvPvqTOAmjSq8xSz1",
  "gVWdJNbS5WVqcUqYc2KC4P0HrR32"
];

export const AUTHORIZED_ADMIN_UID = "n66vwcTu3OZVvPvqTOAmjSq8xSz1";

export const isAuthorizedAdmin = (uid?: string | null): boolean => {
  if (!uid) return false;
  return AUTHORIZED_ADMIN_UIDS.includes(uid);
};

