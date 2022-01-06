import React, { useEffect, useState, useCallback, useMemo, useRef, useLayoutEffect } from "react";
import "./../styles.scss";
import { Link, useParams } from "react-router-dom";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../../firebase-config";

import SendIcon from "@mui/icons-material/Send";
import { Avatar } from "@mui/material";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";

import { ChatInputField } from "../../../styles/styled-components/ChatInputField";
import NoMessages from "./NoMessages";
import { sendMessageToCloudFirestore, uploadImageToStorageBucket } from "./../../../utils/firebaseChatHelpers";
import { SentMessage } from "./../../../styles/styled-components/SentMessage";
import { ReceivedMessage } from "./../../../styles/styled-components/ReceivedMessage";
import { AttachmentHandler } from "./AttachmentHandler";

import { storage } from "./../../../firebase-config";
import { ref, uploadBytes } from "firebase/storage";

const isInvalidText = (msg: string) => {
  //returns true if the msg is only spaces
  return msg.trim().length === 0;
};

export function MessagesPanel({ loggedInUser }) {
  const params = useParams();
  const documentId = params.documentId;
  const [snapshot, loading, error] = useDocumentData(doc(db, "conversations", documentId!), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [messageText, setMessageText] = useState("");
  const noMessages = useMemo(() => (snapshot && snapshot?.messages.length ? false : true), [snapshot]);
  const lastElementInMessages = useRef<any>(null);

  const conversationPartner = useMemo(() => {
    if (!snapshot) return;
    return snapshot.participants.find(user => user.id !== loggedInUser.uid);
  }, [snapshot]);

  useEffect(() => {
    if (!lastElementInMessages.current) return;
    const ref = setTimeout(() => {
      lastElementInMessages.current.scrollIntoView({ behavior: "smooth" });
    }, 300);

    return () => clearTimeout(ref);
  }, [snapshot, lastElementInMessages]);

  const messages =
    snapshot &&
    snapshot.messages.map((message, i) => {
      const isSender = loggedInUser.uid === message.sender;
      return (
        <li key={i} className={isSender ? "align-end" : "align-start"}>
          {isSender ? (
            <SentMessage i={i}>
              {message.imageURL ? <img src={message.imageURL} alt="" /> : <p>{message.text}</p>}
            </SentMessage>
          ) : (
            <ReceivedMessage i={i}>
              {message.imageURL ? <img src={message.imageURL} alt="" /> : <p>{message.text}</p>}
            </ReceivedMessage>
          )}
        </li>
      );
    });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files!.length) return;
    const imageFile = e?.target?.files![0];
    await uploadImageToStorageBucket(imageFile, documentId!, loggedInUser.uid);
  };

  const handleSendMessage = useCallback(async () => {
    if (isInvalidText(messageText)) return;
    await sendMessageToCloudFirestore(messageText, documentId!, loggedInUser.uid);
    setMessageText("");
  }, [messageText]);

  return (
    <section className="messages-panel">
      <div className="messages-panel__header">
        <Link to="/chat" className="messages-panel__header__link">
          <DoubleArrowRoundedIcon />
          Go back
        </Link>
        <Avatar src={conversationPartner?.photoURL} alt={conversationPartner?.displayName} />
        <p>{conversationPartner?.displayName || "Unnamed user"}</p>
      </div>
      <div className="messages-panel__messages-container">
        {noMessages && <NoMessages />}
        {!noMessages && (
          <ul className="message-list">
            {messages}
            <li ref={lastElementInMessages}></li>
          </ul>
        )}
      </div>
      <div className="messages-panel__form-container">
        <AttachmentHandler handleUpload={handleUpload} />
        {/* <input type="file" /> */}
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
