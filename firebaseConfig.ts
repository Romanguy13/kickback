import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

export const FB_APP = initializeApp(firebaseConfig);
export const FB_AUTH = getAuth(FB_APP);
