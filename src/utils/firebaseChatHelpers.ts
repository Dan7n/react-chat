/** ////////////////////////////////////////////////
 * Firebase chat helper functions
 **/ ////////////////////////////////////////////////

import { doc, updateDoc, arrayUnion } from "@firebase/firestore";
import { db } from "../firebase-config";
import { serverTimestamp } from "@firebase/firestore";

/**
 * @abstract function that takes the currently logged in user and the message content as its arguments, and sends the message to the correct conversation document in cloud firestore
 * @param messageText string if the message is text only, otherwise null
 * @param conversationId the conversation docuemnt ID that this message will be sent to
 * @param uid currently logged in user's ID
 * @param URL URL of the file if the message is an image or voice recording
 * @param fileType type of file, either "IMAGE" or "AUDIO"
 */

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
