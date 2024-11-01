// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDR2XQHw9XEv1SIZZY1Fb5-AZ6xSRtyHUs",
  authDomain: "nickle-aeab7.firebaseapp.com",
  projectId: "nickle-aeab7",
  storageBucket: "nickle-aeab7.appspot.com",
  messagingSenderId: "144695166233",
  appId: "1:144695166233:web:903dc7824e77f9820e3188",
  measurementId: "G-RVJECMNYJV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);