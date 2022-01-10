import { ref, uploadBytesResumable } from "@firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { useState, useEffect, useCallback } from "react";
import { storage } from "../firebase-config";
import { sendMessageToCloudFirestore } from "../utils/firebaseChatHelpers";

interface IUploadConfig {
  imageFile: File | null;
  audioFile: Blob | null;
  conversationId: string;
  uid: string;
}

/**
 * Takes a media file of type Blob (if audio) or File (if image) and uploads it to Firebase Storage, then posts the download URL to Cloud Firestore, which updates the UI
 * @returns An array containing @param isUploadLoading which is updated as the upload is undergoing, and a function @param uploadToStorageBucket which runs the upload
 */

export const useUpload = () => {
  const [isUploadLoading, setIsUploadLoading] = useState(false);

  const uploadToStorageBucket = useCallback(async ({ imageFile, audioFile, conversationId, uid }: IUploadConfig) => {
    setIsUploadLoading(true);
    let fileRef;
    if (imageFile) fileRef = ref(storage, imageFile!.name);
    else if (audioFile) fileRef = ref(storage, `AudioFile_${Date.now()}`);

    const fileToUpload = imageFile || audioFile;
    try {
      const uploadTask = uploadBytesResumable(fileRef, fileToUpload!);
      uploadTask.on(
        "state_changed",
        async snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        err => {
          console.log(err);
        },
        async () => {
          const downloadLink = getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
            if (downloadURL) {
              const fileType = imageFile ? "IMAGE" : "AUDIO";
              await sendMessageToCloudFirestore(null, conversationId!, uid!, downloadURL, fileType);
            }
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  return [uploadToStorageBucket, isUploadLoading] as const;
};

export const uploadMediaToStorageBucket = async (
  imgFile?: File | null,
  audioFile?: Blob | null,
  conversationId?: string,
  uid?: string
) => {
  const fileRef = ref(storage, imgFile!.name);
  // let fileRef;
  // if (imgFile) fileRef = ref(storage, imgFile.name)
  // else if (audioFile) fileRef = ref(storage, audioFile)

  try {
    const uploadTask = uploadBytesResumable(fileRef, imgFile!);
    uploadTask.on(
      "state_changed",
      async snapshot => {},
      err => {
        console.log(err);
      },
      async () => {
        const downloadLink = getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          if (downloadURL) await sendMessageToCloudFirestore(null, conversationId!, uid!, downloadURL);
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};