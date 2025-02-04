import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyB9jho9msYUtRZEv-w2mFjG76S53B7P_6M',
    authDomain: 'music-9a83d.firebaseapp.com',
    projectId: 'music-9a83d',
    storageBucket: 'music-9a83d.appspot.com',
    appId: '1:438777742452:web:c93f87c8d15bd063667d21',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const usersCollection = collection(db, 'users'); 
export {
  app,
  auth,
  db,
  usersCollection,
};
