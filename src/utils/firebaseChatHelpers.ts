/** ////////////////////////////////////////////////
 * Firebase chat helper functions
 **/ ////////////////////////////////////////////////

import { doc, updateDoc, arrayUnion } from "@firebase/firestore";
import { db } from "../firebase-config";
import { serverTimestamp } from "@firebase/firestore";

export const sendMessageToCloudFirestore = async (
  messageText: string | null,
  conversationId: string,
  uid: string,
  URL?: string | null,
  fileType?: string
) => {
  const conversationDocRef = doc(db, "conversations", conversationId);

  const messageBody = {
    text: messageText || null,
    imageURL: fileType === "IMAGE" ? URL : null,
    audioURL: fileType === "AUDIO" ? URL : null,
    sender: uid,
    createdAt: Date.now(),
  };
  await updateDoc(conversationDocRef, {
    messages: arrayUnion(messageBody),
    lastUpdated: serverTimestamp(),
  });
};
