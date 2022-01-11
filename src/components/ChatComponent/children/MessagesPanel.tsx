import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import "./../../../styles/components/ChatComponent/styles.scss";
import { Link, useParams } from "react-router-dom";

//Firebase
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { sendMessageToCloudFirestore } from "./../../../utils/firebaseChatHelpers";

//Custom hooks
import { useUpload } from "../../../hooks/useUpload";

//Components
import SendIcon from "@mui/icons-material/Send";
import { Avatar } from "@mui/material";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import { ChatInputField } from "../../../styles/styled-components/ChatInputField";
import NoMessages from "./MessagesPanelChildren/NoMessages";
import { SentMessage } from "./../../../styles/styled-components/SentMessage";
import { ReceivedMessage } from "./../../../styles/styled-components/ReceivedMessage";
import { AttachmentHandler } from "./MessagesPanelChildren/AttachmentHandler";
import { motion } from "framer-motion";

const isInvalidText = (msg: string) => {
  //returns true if the msg is only spaces
  return msg.trim().length === 0;
};

export function MessagesPanel({ loggedInUser }) {
  const [messageText, setMessageText] = useState("");
  const lastElementInMessages = useRef<any>(null);

  const params = useParams();
  const documentId = params.documentId;

  const [snapshot, loading, error] = useDocumentData(doc(db, "conversations", documentId!), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const noMessages = useMemo(() => (snapshot && snapshot?.messages.length ? false : true), [snapshot]);
  const [uploadToStorageBucket, isUploadLoading] = useUpload();

  const conversationPartner = useMemo(() => {
    if (!snapshot) return;
    return snapshot.participants.find(user => user.id !== loggedInUser.uid);
  }, [snapshot]);

  useEffect(() => {
    //Scroll to the bottom when a new message is sent/received
    if (!lastElementInMessages.current) return;
    const ref = setTimeout(() => {
      lastElementInMessages.current.scrollIntoView({ behavior: "smooth" });
    }, 300);

    return () => clearTimeout(ref);
  }, [snapshot, lastElementInMessages]);

  //Get each single text message/media file
  const messages = useMemo(() => {
    if (!snapshot) return <></>;

    return snapshot.messages.map((message, i) => {
      const isSender = loggedInUser.uid === message.sender;
      return (
        <li key={i} className={isSender ? "align-end" : "align-start"}>
          {/* if message is of type text */}
          {message.text &&
            (isSender ? (
              <SentMessage i={i}>
                <p>{message.text}</p>
              </SentMessage>
            ) : (
              <ReceivedMessage i={i}>
                <p>{message.text}</p>
              </ReceivedMessage>
            ))}

          {/* if message is an image */}
          {message.imageURL && (
            <motion.img
              initial={{ opacity: 0, translateY: 60 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              src={message.imageURL}
              alt=""
            />
          )}

          {/* if message is an audio recording */}
          {message.audioURL && (
            <motion.audio
              initial={{ opacity: 0, translateY: 60 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              controls
              src={message.audioURL}
            />
          )}
        </li>
      );
    });
  }, [loggedInUser.uid, snapshot]);

  //Action handlers
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files!.length) return;
    const imageFile = e?.target?.files![0];
    const config = {
      imageFile,
      audioFile: null,
      conversationId: documentId!,
      uid: loggedInUser.uid,
    };
    await uploadToStorageBucket(config);
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
      <div className="messages-panel__header-lights" role="presentation"></div>
      <div className="messages-panel__messages-container">
        {noMessages && !loading && <NoMessages />}
        {!noMessages && (
          <ul className="message-list">
            {messages}
            <li ref={lastElementInMessages}></li>
          </ul>
        )}
      </div>
      <div className="messages-panel__form-container">
        <AttachmentHandler handleUpload={handleUpload} conversationId={documentId} uid={loggedInUser.uid} />
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
