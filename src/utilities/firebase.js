import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "notezzz.firebaseapp.com",
  projectId: "notezzz",
  storageBucket: "notezzz.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSENGERID,
  appId: process.env.REACT_APP_APP_ID,
};

export const auth = firebase.initializeApp(firebaseConfig).auth();
export const db = firebase.firestore();

auth.setPersistence("local");
