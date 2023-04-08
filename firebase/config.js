import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKRu3eV3iiaaKjofZtzf8wmbe2Y5NGNDw",
  authDomain: "react-native-sn-project.firebaseapp.com",
  projectId: "react-native-sn-project",
  storageBucket: "react-native-sn-project.appspot.com",
  messagingSenderId: "291568505937",
  appId: "1:291568505937:web:162a2a015563508edb1470"
};

initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore();