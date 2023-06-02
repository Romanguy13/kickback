import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDfUccImdVEd5SHzXIBs3xN38M_eaD3wtc',
  authDomain: 'kickback-54b8e.firebaseapp.com',
  projectId: 'kickback-54b8e',
  storageBucket: 'kickback-54b8e.appspot.com',
  messagingSenderId: '976975121634',
  appId: '1:976975121634:web:a325281a9bf183a0e5e2bb',
  measurementId: 'G-HB1S3H85WJ',
};
export const FB_APP = initializeApp(firebaseConfig, 'Production');
export const FB_AUTH = getAuth(FB_APP);
export const FB_DB = getFirestore(FB_APP);
export const FB_STORAGE = getStorage(FB_APP);

connectFirestoreEmulator(FB_DB, 'localhost', 8080);
connectAuthEmulator(FB_AUTH, 'http://127.0.0.1:9099');
connectStorageEmulator(FB_STORAGE, 'localhost', 9199);