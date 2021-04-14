import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import firebaseConfig from "./firebaseConfig";

if (!firebase.apps.length) {
  console.log("firebase", firebase);
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

export const usersCollection = firestore.collection("users");

export const clientsCollection = firestore.collection("clients");
export const projectsCollection = firestore.collection("projects");
