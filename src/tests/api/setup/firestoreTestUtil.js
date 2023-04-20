import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// const projectId = 'kickback-dev-5367b';

export default function createTestFirestore() {
  const app = initializeApp({
    apiKey: 'AIzaSyDfUccImdVEd5SHzXIBs3xN38M_eaD3wtc',
    authDomain: 'kickback-54b8e.firebaseapp.com',
    projectId: 'kickback-54b8e',
    storageBucket: 'kickback-54b8e.appspot.com',
    messagingSenderId: '976975121634',
    appId: '1:976975121634:web:a325281a9bf183a0e5e2bb',
    measurementId: 'G-HB1S3H85WJ',
  });
  const firestore = getFirestore(app);
  connectFirestoreEmulator(firestore, 'localhost', 8080);

  // Return the firestore object
  return firestore;
}
