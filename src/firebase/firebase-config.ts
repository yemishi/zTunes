import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_AUTH_DOMAIN,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: "ztunes-695af",
  storageBucket: "ztunes-695af.appspot.com",
  messagingSenderId: "139005161100",
  appId: "1:139005161100:web:2eb43a53b6d2cc6d9a55a9",
  measurementId: "G-ED2ZH22R6F",
};

const app = initializeApp(firebaseConfig);
export const analytics = getStorage(app);
