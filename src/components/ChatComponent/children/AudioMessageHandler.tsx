import React, { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MicIcon from "@mui/icons-material/Mic";
import { motion } from "framer-motion";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.5rem",
};

//set up microphone functions
const getRecorderInstance = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  return new MediaRecorder(stream);
};

const handleData = (e?: BlobEvent, setState?: React.Dispatch<React.SetStateAction<string>>) => {
  if (!e || !setState) return;
  const audioURL = URL.createObjectURL(e.data);
  setState(audioURL);
};

export const AudioMessageHandler = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");

  //Event handlers ---------------------
  const handleRecord = useCallback(() => {
    if (!isRecording) setIsRecording(true);
    else setIsRecording(false);
  }, [isRecording, recorder]);

  const handleClose = () => {
    setIsMenuOpen(false);
    setRecorder(null);
    setIsRecording(false);
    setAudioURL("");
  };

  const handleSend = () => {
    console.log("Send");
  };

  //Set up media recorder ---------------------
  useEffect(() => {
    if (!recorder && isRecording) {
      getRecorderInstance().then(mediaRecorder => setRecorder(mediaRecorder));
      return;
    } else if (recorder) {
      recorder!.addEventListener("dataavailable", e => handleData(e, setAudioURL));
    }
    return () => {
      if (recorder) {
        recorder.removeEventListener("dataavailable", handleData);
      }
    };
  }, [recorder, isRecording]);

  useEffect(() => {
    if (isRecording && recorder) {
      recorder.start();
    } else if (!isRecording && recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  }, [isRecording, recorder]);

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
            {audioURL && (
              <motion.audio
                controls
                src={audioURL}
                initial={{ opacity: 0, translateY: -40 }}
                animate={{ opacity: 1, translateY: 0 }}
              />
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
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
