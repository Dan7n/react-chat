import "firebase/firestore";
import "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

//Firebase config information can be exposed safely without fear of compromising your application
const firebaseConfig = {
  apiKey: "AIzaSyDiFDZKSHZ1prNvvxGle1C5MQiolcbLSi8",
  authDomain: "react-chat-aad5f.firebaseapp.com",
  projectId: "react-chat-aad5f",
  storageBucket: "react-chat-aad5f.appspot.com",
  messagingSenderId: "924554811670",
  appId: "1:924554811670:web:00c9cafa11683041359837",
  measurementId: "G-8D9WXV2SGX",
};

//Firebase config variables
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();

//Collection referenses
export const usersCollectionRef = collection(db, "users");
export const conversationsCollectionRef = collection(db, "conversations");
