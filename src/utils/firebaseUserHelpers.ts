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
import { sendPasswordResetEmail, updateProfile, getAuth, User } from "firebase/auth";
import { IUser } from "../models/IUser";
import { IDefaultProfileInfo } from "../models/IDefaultProfileInfo";
import { IConversationUser } from "../models/IConversationUser";

//------------------------------------------------------------------

/**
 * Finds a user in the "users" collection in cloud firestore
 * @param queryString the phone number of email adress we're querying
 * @param queryType either the string "email" or "phoneNumber"
 * @returns the user object if it exists, otherwise null
 */

export const findUserByEmailOrPhoneNumber = async (queryType: string, queryString: string) => {
  let foundUser: IUser | any;
  let userExists;
  let errorMessage;
  let done;
  const searchQuery = query(usersCollectionRef, where(queryType, "==", queryString));

  try {
    const userSnapshot = await getDocs(searchQuery);

    if (userSnapshot.empty) {
      foundUser = null;
      userExists = false;
      errorMessage = `No users found with this ${queryType}`;
      done = "OK";
    } else {
      userSnapshot.forEach(doc => {
        foundUser = doc.data();
        userExists = true;
        errorMessage = null;
      });
    }
  } catch (error) {
    if (error) {
      console.log("Error while trying to find user: ", error);
      errorMessage = error;
    }
  } finally {
    done = "OK";
    return { foundUser, userExists, errorMessage, done };
  }
};

//------------------------------------------------------------------

/**
 *
 * @param userCredentials firebase credentials object
 * @returns true if document exists in the "users" collection, otherwise false
 */
export const checkIfUserExists = async (userCredentials: any) => {
  //Get a reference to the user document
  const docRef = doc(db, "users", userCredentials.uid);

  //Check if user is already saved in cloud firestore
  const docSnapshot = await getDoc(docRef);
  return docSnapshot.exists();
};

//------------------------------------------------------------------

export const createUserInCloudFirestore = async (userCredentials: any) => {
  //Note: all documents in the "users" collections have a title that's equal to their UID, this makes it much easier and more efficient when querying
  const docRef = doc(db, "users", userCredentials.uid);

  const isUserRegistered = await checkIfUserExists(userCredentials);
  if (isUserRegistered) return console.log("User exists");

  const newUser = {
    id: userCredentials.uid,
    displayName: userCredentials.displayName,
    email: userCredentials.email,
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

export const sendPasswordReset = async (userEmail: string) => {
  return sendPasswordResetEmail(auth, userEmail);
};

//------------------------------------------------------------------

export const createNewConversation = async (loggedInUser: User, receiver: IConversationUser) => {
  const loggedInUserParticipant = {
    id: loggedInUser.uid,
    displayName: loggedInUser.displayName,
    photoURL: loggedInUser.photoURL,
  };

  const newConversationObj = {
    createdAt: serverTimestamp(),
    participants: [loggedInUserParticipant, receiver],
    messages: [],
    lastUpdated: serverTimestamp(),
  };

  const userDocumentRef = doc(db, "users", loggedInUser.uid);
  const receiverDocumentRef = doc(db, "users", receiver.id);

  try {
    const newConversationDocument = await addDoc(conversationsCollectionRef, newConversationObj);
    const newDocumentId = await newConversationDocument.id;

    //add a reference to this new conversation to both sender and receiver user documents
    await updateDoc(userDocumentRef, {
      conversations: arrayUnion(newDocumentId),
    });
    await updateDoc(receiverDocumentRef, {
      conversations: arrayUnion(newDocumentId),
    });

    return newConversationDocument;
  } catch (error) {
    error && console.log("An error has occured while creating a new conversation: ", error);
  }
};

//------------------------------------------------------------------

export const updateCurrentlyLoggedInUserProfile = async (updatedProfileInfo: IDefaultProfileInfo) => {
  const auth = getAuth();
  console.log("From backend: ", updatedProfileInfo);

  try {
    if (auth.currentUser) {
      //Update the user document in cloud firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userDocRef, updatedProfileInfo, { merge: true });

      //and the user profile in firebase auth
      await updateProfile(auth.currentUser, updatedProfileInfo);
    }
  } catch (error) {
    console.log(error);
  }
};

//------------------------------------------------------------------
