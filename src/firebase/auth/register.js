import { auth, usersCollection, firestore, projectsCollection } from "./index";
import firebase from "firebase/app";
import axios from "axios";
import "firebase/firestore";
import "firebase/auth";
var CryptoJS = require("crypto-js")
 
//CUSTOM TOKEN CREATION

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

  //REGISTER WITH EMAIL
  export const registerWithEmail = ({
    email,
    fullName,
    password,
    company,
    isNewCompany,
    companyRole,
    isAssociated,
    hasCompany,
  }) =>
    new Promise((resolve, reject) => {
      auth.createUserWithEmailAndPassword(email, password).then((credential) => {
        projectsCollection
          .where("invitedEmails", "array-contains", email)
          .get()
          .then((snapshot) => {
            const sharedProjects = snapshot.docs.map((doc) => doc.ref.id);
            console.log("shared", sharedProjects);
            const data = {
              password,
              email,
              company,
              fullName,
              uid: credential.user.uid,
              ownProjects: [],
              sharedProjects,
            };
            const ciphertext = CryptoJS.AES.encrypt(
              JSON.stringify(data),
              "Robo#2021"
            ).toString();
            const actionCodeSettings = {
              url: `http://localhost:3000/verify-email?code=${encodeURIComponent(
                ciphertext
              )}`,
            };
            credential.user
              .sendEmailVerification(actionCodeSettings)
              .then(() => resolve());
          })
          .catch((e) => {
            console.log("final promise", e);
            reject(e);
          });
      });
    });

//FINISH SIGNUP AFTER LINK

export const finishSignup = (user) => {
    const href = window.location.href;
    // const code = decodeURIComponent(href).match(/(?<=code=).*(?=&mode)/)[0];
    return new Promise((resolve, reject) => {
      if (auth.isSignInWithEmailLink(href)) {
        console.log("data in finish signup", href);
        const dataString = href
          .substring(href.indexOf("="), href.indexOf("%"))
          .substring(1, href.indexOf("&"));
        const split = dataString.split("&");
        const [email, pId] = split;
        console.log("email and Pid", email, pId);
        // Check in User Docs for matching email
        firestore
          .collection("users")
          .where("email", "==",  email)
          .get()
          .then((res) => {
            console.log("return user in res", res);
            // Found Matching email
            if (!res.empty) {
              // Update user doc's sharedProjects field with project id
              firestore
                .collection("users")
                .doc(res.docs[0].id)
                .update({
                  sharedProjects: firebase.firestore.FieldValue.arrayUnion(pId),
                })
                .then((updated) => {
                  console.log("updated", updated);
                  // Update project docs' sharedUsers with user id
                  firestore
                    .collection("projects")
                    .doc(pId)
                    .update({
                      sharedUsers : firebase.firestore.FieldValue.arrayUnion(res.docs[0].id),
                    })
                    .then((updated) => {
                      console.log("updated", updated);
                      resolve("Login");
                    })
                })
            }
            // No matching user found, so create new user
            else {
              resolve([email, pId]);
            }
          })
      } else {
        console.log("notSignInWithEmailLink");
        reject();
      }
    });
  };


 //ADD USER TO COLLECTION
 const addUserDoc = (credential, values) => {
    return new Promise((resolve, reject) => {
      usersCollection
        .doc(credential.user.uid)
        .set(values)
        .then(() => {
          resolve(getCustomToken(credential));
        })
        .catch((e) => {
          console.log(e);
          reject(e);
        });
    });
  };