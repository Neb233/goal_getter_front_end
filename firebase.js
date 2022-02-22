import { initializeApp } from "firebase/app";
import {getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCpk6WBH9wpxDqeMOKR5m8IbieOzqmNodU",
  authDomain: "goalgetter-4937c.firebaseapp.com",
  projectId: "goalgetter-4937c",
  storageBucket: "goalgetter-4937c.appspot.com",
  messagingSenderId: "502285142372",
  appId: "1:502285142372:web:57911be048a440bd719271"
};


const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app)