import { auth, usersCollection, firestore, projectsCollection } from "./index";
import firebase from "firebase/app";
import axios from "axios";
import "firebase/firestore";
import "firebase/auth";
var CryptoJS = require("crypto-js");

//CREATING TOKEN FOR FIREBASE AUTH
const getCustomToken = (credential) => {
    return new Promise((resolve, reject) => {
      credential.user.getIdToken(true).then((idToken) => {
        axios
          .post(
            `https://us-central1-disco-outpost-268223.cloudfunctions.net/createToken`,
            JSON.stringify({
              data: {},
            }),
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            firebase
              .auth()
              .signInWithCustomToken(res.data.result.customToken)
              .then((credential) => {
                const user = credential.user;
                firestore
                  .collection("users")
                  .doc(user.uid)
                  .get()
                  .then((userDoc) => {
                    resolve({ ...user, ...userDoc.data() });
                  })
                  .catch((e) => {
                    console.log(e);
                    reject(e.message);
                  });
              })
              .catch((error) => {
                console.log(error);
                reject(error.message);
              });
          })
          .catch((err) => {
            reject();
          });
      });
    });
  };

 //LOGIN WITH GOOGLE
 export const loginWithGoogle = () =>
  new Promise((resolve, reject) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then((result) => {
        console.log("result", result);
        auth.signInWithPopup(provider).then((credential) => {
          usersCollection
            .doc(credential.user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                resolve(getCustomToken(credential));
              } else {
                projectsCollection
                  .where(
                    "invitedUsers",
                    "array-contains",
                    credential.user.email
                  )
                  .get()
                  .then((snapshot) => {
                    resolve(
                      addUserDoc(credential, {
                        email: credential.user.email,
                        fullName: credential.user.fullName || "",
                        sharedProjects: snapshot.docs.map((doc) => doc.id),
                      })
                    );
                  });
              }
            })
            .catch((e) => reject(e));
        });
      });
  });

  //LOGIN WITH EMAIL
  export const loginWithEmail = (email, password) =>
  new Promise((resolve, reject) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((credential) => {
        console.log("user on login", credential);
        if (!credential.user.emailVerified) {
          resolve(getCustomToken(credential));
        } else {
          resolve(getCustomToken(credential));
        }
      })
      .catch((e) =>
        reject({
          status: "error",
          message: e.message,
        })
      );
  });


  //ANON LOGIN
  export const loginAnonymously = () => {
    return new Promise((resolve, reject) => {
      auth
        .signInAnonymously()
        .then((credential) => {
          resolve(credential.user);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };




  //LOGOUT
export const logout = () => auth.signOut();

  