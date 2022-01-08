import React, { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MicIcon from "@mui/icons-material/Mic";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.5rem",
};

const getRecorderInstance = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return new MediaRecorder(stream);
};

const handleData = (e: BlobEvent, setState: React.Dispatch<React.SetStateAction<string>>) => {
  const audioURL = URL.createObjectURL(e.data);
  setState(audioURL);
};

export const AudioMessageHandler = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");

  useEffect(() => {
    if (!recorder) {
      //start recording when use clicks on the "record" button
      getRecorderInstance().then(mediaRecorder => setRecorder(mediaRecorder));
      return;
    }
    recorder.addEventListener("dataavailable", e => handleData(e, setAudioURL));
  }, [recorder, isRecording]);

  useEffect(() => {
    if (isRecording && recorder) {
      recorder.start();
    } else if (!isRecording && recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  }, [isRecording, recorder]);

  const handleRecord = useCallback(() => {
    if (!isRecording) setIsRecording(true);
    else setIsRecording(false);
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
            Press the microphone icon below to start recording
            <MicIcon sx={{ width: 100, height: 100 }} onClick={handleRecord} />
            {audioURL && <audio controls src={audioURL}></audio>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMenuOpen(false)}>Cancel</Button>
          <Button onClick={() => console.log("send audio")} autoFocus>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
