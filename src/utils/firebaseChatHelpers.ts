import { storage } from "./../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "@firebase/firestore";
import { usersCollectionRef, conversationsCollectionRef, db, auth } from "../firebase-config";
import { serverTimestamp } from "@firebase/firestore";

export const sendMessageToCloudFirestore = async (
  messageText: string | null,
  conversationId: string,
  uid: string,
  imageURL?: string | null
) => {
  const conversationDocRef = doc(db, "conversations", conversationId);

  const messageBody = {
    text: messageText || null,
    imageURL: imageURL || null,
    sender: uid,
    createdAt: Date.now(),
  };
  await updateDoc(conversationDocRef, {
    messages: arrayUnion(messageBody),
    lastUpdated: serverTimestamp(),
  });
};

export const uploadImageToStorageBucket = async (imgFile: File, conversationId: string, uid: string) => {
  const fileRef = ref(storage, imgFile.name);
  try {
    const uploadTask = uploadBytesResumable(fileRef, imgFile);
    uploadTask.on(
      "state_changed",
      async snapshot => {},
      err => {
        console.log(err);
      },
      async () => {
        const downloadLink = getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          if (downloadURL) await sendMessageToCloudFirestore(null, conversationId, uid, downloadURL);
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
