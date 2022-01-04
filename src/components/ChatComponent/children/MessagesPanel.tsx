import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { sendMessageToCloudFirestore } from "./../../../utils/firebaseUserHelpers";
import { SentMessage } from "./../../../styles/styled-components/SentMessage";
import { ReceivedMessage } from "./../../../styles/styled-components/ReceivedMessage";

export function MessagesPanel({ loggedInUser }) {
  const params = useParams();
  const documentId = params.documentId;
  const [snapshot, loading, error] = useDocumentData(doc(db, "conversations", documentId!), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [messageText, setMessageText] = useState("");
  const noMessages = useMemo(() => (snapshot && snapshot?.messages.length ? false : true), [snapshot]);

  useEffect(() => {
    // console.log({ documentId });
    if (snapshot) console.log(snapshot);
    console.log({ loggedInUser });
    // if (error) console.log(error);
  }, [snapshot]);

  const messages =
    snapshot &&
    snapshot.messages.map((message, i) => {
      const isSender = loggedInUser.uid === message.sender;
      console.log(message);
      return (
        <li key={i} className={isSender ? "align-end" : "align-start"}>
          {isSender ? (
            <SentMessage i={i}>
              <p>{message.text}</p>
            </SentMessage>
          ) : (
            <ReceivedMessage i={i}>
              <p>{message.text}</p>
            </ReceivedMessage>
          )}
        </li>
      );
    });

  const handleSendMessage = useCallback(async () => {
    await sendMessageToCloudFirestore(messageText, documentId!, loggedInUser.uid);
    setMessageText("");
  }, [messageText]);

  return (
    <section className="messages-panel">
      <Link to="/chat">Back to conversations</Link>
      <div className="messages-panel__messages-container">
        {noMessages && <NoMessages />}
        {!noMessages && <ul className="message-list">{messages}</ul>}
      </div>
      <div className="messages-panel__form-container">
        <AddCircleOutlineIcon className="icon" />
        <ChatInputField
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyUp={e => e.shiftKey && e.key === "Enter" && handleSendMessage()}
          placeholder="Write a message"
        />
        <SendIcon className="icon" onClick={handleSendMessage} />
      </div>
    </section>
  );
}
