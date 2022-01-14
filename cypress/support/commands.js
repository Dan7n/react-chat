// import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig, firebaseApp, db, auth } from "./../../src/firebase-config";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import { attachCustomCommands } from "cypress-firebase";
import "cypress-file-upload";
const { getAuth, signOut } = require("firebase/auth");

//configure cypress-firebase to add some custom commands
firebase.initializeApp(firebaseConfig);
attachCustomCommands({ Cypress, cy, firebase });

//Custom Command to log out of firebase when needed
Cypress.Commands.add("signOutFromFirebase", async () => {
  const auth = getAuth(firebaseApp);
  await signOut(auth);
});
