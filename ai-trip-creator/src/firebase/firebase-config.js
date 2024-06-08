import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwuPv1t0KhiADo9MK7SZbWPgfWNcaTAeA",
  authDomain: "ai-trip-creator.firebaseapp.com",
  databaseURL: "https://ai-trip-creator-default-rtdb.firebaseio.com",
  projectId: "ai-trip-creator",
  storageBucket: "ai-trip-creator.appspot.com",
  messagingSenderId: "300004223652",
  appId: "1:300004223652:web:a2b08dffaeb9f9b44fd431",
  measurementId: "G-K1EFHGGM1S",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
