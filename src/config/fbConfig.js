import firebase from "firebase/app";
import "firebase/firestore"; // firestore is the database
import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCUSMTmxBeSj5A6xIOpUVlUOEAbrr2lA5U",
  authDomain: "ninja-marioplan-190619.firebaseapp.com",
  databaseURL: "https://ninja-marioplan-190619.firebaseio.com",
  projectId: "ninja-marioplan-190619",
  storageBucket: "ninja-marioplan-190619.appspot.com",
  messagingSenderId: "186845102950",
  appId: "1:186845102950:web:b1e091406ff8b0be"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;
