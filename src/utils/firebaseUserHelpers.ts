import {
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "@firebase/firestore";

import { usersCollectionRef, conversationsCollectionRef, db, auth } from "../firebase-config";

/**
 * Finds a user in the "users" collection in cloud firestore
 * @param queryString the phone number of email adress we're querying
 * @param queryType either the string "email" or "phoneNumber"
 * @returns the user object if it exists, otherwise null
 */

export const findUserByEmailOrPhoneNumber = async (queryString: string, queryType: string) => {
  let foundUser;
  let userExists;
  let errorMessage;
  let done;

  const searchQuery = query(usersCollectionRef, where(queryType, "==", queryString));

  try {
    const userSnapshot = await getDocs(searchQuery);
    userSnapshot.forEach(doc => {
      if (!doc.exists) {
        foundUser = null;
        userExists = false;
      } else {
        foundUser = doc.data();
        userExists = true;
      }
    });
  } catch (error) {
    if (error) {
      console.log("Error while trying to find user: ", error);
      errorMessage = error;
    }
  } finally {
    done = "OK";
  }

  return { foundUser, userExists, errorMessage, done };
};

export const createUserInCloudFirestore = async (userCredentials: any) => {
  //Note: all documents in the "users" collections have a title that's equal to their UID, this makes it much easier and more efficient when querying

  //Get a reference to the user document
  const docRef = doc(db, "users", userCredentials.uid);

  //Check if user is already saved in cloud firestore
  const docSnapshot = await getDoc(docRef);
  const isUserRegistered = docSnapshot.exists();

  if (isUserRegistered) return console.log("User exists");

  const newUser = {
    id: userCredentials.uid,
    displayName: userCredentials.displayName,
    email: userCredentials.email,
    emailVerified: userCredentials.emailVerified,
    phoneNumber: userCredentials.phoneNumber,
    photoURL: userCredentials.photoURL,
    conversations: [],
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, newUser);
  } catch (error) {
    error && console.log("An error has occured while creating a user: ", error);
  }
};
