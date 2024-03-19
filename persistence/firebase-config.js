import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDckmovdPrycl8tepJIk8Hciv1GabqGjK8",
  authDomain: "dots-connect-lp.firebaseapp.com",
  projectId: "dots-connect-lp",
  storageBucket: "dots-connect-lp.appspot.com",
  messagingSenderId: "191706451506",
  appId: "1:191706451506:web:ec61f745264342922e362b",
  measurementId: "G-1YKH4JZ2CE",
  databaseURL: "https://dots-connect-lp-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
