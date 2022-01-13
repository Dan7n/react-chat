import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { updateLoadingState } from "./../../state/actionCreators";
import { IAction } from "../../../../models/IAction";

//Components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MicIcon from "@mui/icons-material/Mic";

//Custom hooks
import { useUpload } from "../../../../hooks/useUpload";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.5rem",
};

const motionVariants = {
  hidden: { opacity: 0, translateY: -40 },
  visible: { opacity: 1, translateY: 0 },
};

//set up microphone functions
const getRecorderInstance = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  return new MediaRecorder(stream);
};

/**
 * @abstract Component that shows a dialog with a record button - users can record audio, listen to their recording and send it to the storage bucket
 * @param conversationId: document ID in cloud firestore
 * @param uid: the ID to the currently logged in user
 */

interface IAudioMessageHandler {
  conversationId: string;
  uid: string;
  dispatch: React.Dispatch<IAction>;
}

export const AudioMessageHandler = ({ conversationId, uid, dispatch }: IAudioMessageHandler) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [error, setError] = useState(false);

  //store a reference to the blob object that we'll eventually upload to cloud storage
  const blob = useRef<Blob | null>(null);

  const [uploadToStorageBucket, isUploadLoading] = useUpload();

  const handleClose = () => {
    setIsMenuOpen(false);
    setRecorder(null);
    setIsRecording(false);
    setAudioURL("");
    setError(false);
  };

  //Side effects ---------------------------------------------------------------
  useEffect(() => {
    //show/hide loader when upload is undergoing
    dispatch(updateLoadingState(isUploadLoading));
  }, [isUploadLoading]);

  useEffect(() => {
    //cleanup after the menu is closed
    if (!isMenuOpen) handleClose();
  }, [isMenuOpen]);

  //Set up media recorder ---------------------
  useEffect(() => {
    if (!recorder && isRecording) {
      getRecorderInstance().then(mediaRecorder => setRecorder(mediaRecorder));
      return;
    } else if (recorder) {
      recorder!.addEventListener("dataavailable", e => handleData(e));
    }
    return () => {
      //cleanup
      if (recorder) {
        recorder.removeEventListener("dataavailable", handleData);
      }
    };
  }, [recorder, isRecording]);

  useEffect(() => {
    //when the user clicks on the microphone
    if (isRecording && recorder) {
      if (error) setError(false);
      recorder.start();
    } else if (!isRecording && recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  }, [isRecording, recorder]);

  //Event handlers ---------------------------------------------------------------
  const handleRecord = useCallback(() => {
    if (!isRecording) setIsRecording(true);
    else setIsRecording(false);
  }, [isRecording, recorder]);

  const handleData = (e?: BlobEvent) => {
    if (!e) return;
    const audioURL = URL.createObjectURL(e.data);
    setAudioURL(audioURL);
    //update blob reference
    blob.current = [e.data][0];
  };

  const handleSend = () => {
    if (!blob.current) return setError(true);
    const config = {
      imageFile: null,
      audioFile: blob.current,
      conversationId,
      uid,
    };
    uploadToStorageBucket(config);
    setIsMenuOpen(false);
  };

  return (
    <div>
      <p style={style} onClick={() => setIsMenuOpen(true)}>
        <MicIcon /> Send audio file
      </p>
      <Dialog open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <DialogTitle>{"Send an audio recording"}</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              flexDirection: "column",
            }}>
            Click on the microphone icon below to start recording, click again to stop and listen to your recording.
            <MicIcon
              sx={{
                width: 100,
                height: 100,
                color: isRecording ? "#e63946" : "#353535",
                transition: "all ease 300ms",
                cursor: "pointer",
              }}
              onClick={handleRecord}
            />
            {error && (
              <motion.p
                className="error-message"
                variants={motionVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3 }}>
                Please record something first
              </motion.p>
            )}
            {audioURL && (
              <motion.audio controls src={audioURL} variants={motionVariants} initial="hidden" animate="visible" />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMenuOpen(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleSend} autoFocus>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
