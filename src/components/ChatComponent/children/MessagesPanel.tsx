import React, { useEffect, useState } from "react";
import "./../styles.scss";
import { Link, useParams } from "react-router-dom";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../../firebase-config";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import { ChatInputField } from "../../../styles/styled-components/ChatInputField";
import NoMessages from "./NoMessages";

export function MessagesPanel({ loggedInUser }) {
  const params = useParams();
  const documentId = params.documentId;
  const [snapshot, loading, error] = useDocumentData(doc(db, "conversations", documentId!), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    console.log({ documentId });
    if (snapshot) console.log(snapshot);
    if (error) console.log(error);
  }, [snapshot]);

  return (
    <section className="messages-panel">
      <Link to="/chat">Back to conversations</Link>
      <div className="messages-panel__messages-container">
        <NoMessages />
      </div>
      <div className="messages-panel__form-container">
        <AddCircleOutlineIcon className="icon" />
        <ChatInputField
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder="Write a message"
        />
        <SendIcon className="icon" />
      </div>
    </section>
  );
}
