import firebase from "firebase";
import "firebase/firestore";
import "firebase/firebase-auth";
import "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbeGRuO2uQsOJ3edZT7ipDcpBDP_crSws",
  authDomain: "mooreadvice-test.firebaseapp.com",
  databaseURL: "https://mooreadvice-test.firebaseio.com",
  projectId: "mooreadvice-test",
  storageBucket: "mooreadvice-test.appspot.com",
  messagingSenderId: "670190090368",
  appId: "1:670190090368:web:5ce3a7c47f58bdb96fce65",
  measurementId: "G-98QH5VXX2Y",
};

// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);

//libraries in use
const db = firebase.firestore();
const fv = firebase.firestore.FieldValue;
const sv = firebase.database.ServerValue;

//enable persistence
db.enablePersistence({ synchronizeTabs: true });

//export
export { fb, db, fv, sv };
firebase.analytics();
