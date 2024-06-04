import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCwy3Mb7pmVjre4ok_MH-SZP8XjhZgbbrE",
  authDomain: "doseja-bba17.firebaseapp.com",
  projectId: "doseja-bba17",
  storageBucket: "doseja-bba17.appspot.com",
  messagingSenderId: "587732080826",
  appId: "1:587732080826:web:6fa289393acd07e0888a83"
};


export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP , {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
