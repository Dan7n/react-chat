import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import "./../../../styles/components/ChatComponent/styles.scss";
import { Link, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { IAction } from "../../../models/IAction";
import { updateLoadingState } from "../state/actionCreators";
import useSound from "use-sound";

//Firebase
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { sendMessageToCloudFirestore } from "./../../../utils/firebaseChatHelpers";
import { User } from "firebase/auth";

//Custom hooks and helper functions
import { useUpload } from "../../../hooks/useUpload";
import { checkValidImageFormat } from "./../../../utils/regexHelpers";
import { handleInvalidImgFormat } from "./../../../utils/toastHelpers";

//Components
import SendIcon from "@mui/icons-material/Send";
import { Avatar } from "@mui/material";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import { ChatFieldInput } from "../../../styles/styled-components/ChatInputField";
import NoMessages from "./MessagesPanelChildren/NoMessages";
import { SentMessage } from "./../../../styles/styled-components/SentMessage";
import { ReceivedMessage } from "./../../../styles/styled-components/ReceivedMessage";
import { AttachmentHandler } from "./MessagesPanelChildren/AttachmentHandler";
import { GoBackBtn } from "../../../styles/styled-components/GoBackBtn";
import InputEmoji from "react-input-emoji";

const popSound = require("./../../../assets/pop.mp3");

const isInvalidText = (msg: string) => {
  //returns true if the msg is only spaces
  return msg.trim().length === 0;
};

interface IMessagesPanel {
  loggedInUser: User;
  dispatch: React.Dispatch<IAction>;
}

export function MessagesPanel({ loggedInUser, dispatch }: IMessagesPanel) {
  const [messageText, setMessageText] = useState("");
  const lastElementInMessages = useRef<HTMLDivElement>(null);

  const params = useParams();
  const location = useLocation();
  const documentId = params.documentId;
  const [play] = useSound(popSound);

  const [snapshot, loading] = useDocumentData(doc(db, "conversations", documentId!), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const noMessages = useMemo(() => (snapshot && snapshot?.messages.length ? false : true), [snapshot]);
  const [uploadToStorageBucket, isUploadLoading] = useUpload();

  const conversationCreatedAt = useMemo(() => {
    if (!snapshot) return;
    return snapshot?.createdAt?.toDate();
  }, [snapshot?.createdAt]);

  const conversationPartner = useMemo(() => {
    if (!snapshot) return;
    return snapshot.participants.find(user => user.id !== loggedInUser.uid);
  }, [snapshot]);

  //Side effects --------------------------------------------

  useEffect(() => {
    //Scroll to the bottom when a new message is sent/received
    if (!lastElementInMessages.current) return;
    const ref = setTimeout(() => {
      lastElementInMessages!.current!.scrollIntoView({ behavior: "smooth" });
    }, 300);

    return () => clearTimeout(ref);
  }, [snapshot, lastElementInMessages]);

  useEffect(() => {
    //shows/hides loading state when an image is sent
    dispatch(updateLoadingState(isUploadLoading));
  }, [isUploadLoading]);

  //Get each single text message/media file --------------------------------------------
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

  const getNavLink = useCallback((): string => {
    //returns correct navlink based on which route you're on
    return location.pathname.includes("profile") ? "/chat/profile" : "/chat";
  }, [location.pathname]);

  //Action handlers --------------------------------------------
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files!.length) return;
    const filePath = e.target.value;
    const isValidImageFormat = checkValidImageFormat(filePath);
    if (!isValidImageFormat) return handleInvalidImgFormat();
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
    play();
    setMessageText("");
  }, [messageText, documentId]);

  return (
    <section className="messages-panel">
      <div className="messages-panel__header">
        <GoBackBtn to={getNavLink()} />
        <Avatar src={conversationPartner?.photoURL} alt={conversationPartner?.displayName} />
        <p>{conversationPartner?.displayName || "Unnamed user"}</p>
      </div>
      <div className="messages-panel__header-lights" role="presentation"></div>
      <div className="messages-panel__messages-container">
        {noMessages && !loading && <NoMessages />}
        {!noMessages && (
          <ul className="message-list" data-cy="messagesContainer">
            <p className="message-list__started">Conversation started on {conversationCreatedAt.toDateString()}</p>
            {messages}
            <div ref={lastElementInMessages} aria-hidden role="presentation"></div>
          </ul>
        )}
      </div>
      <div className="messages-panel__form-container">
        <AttachmentHandler
          handleUpload={handleUpload}
          conversationId={documentId!}
          uid={loggedInUser.uid}
          dispatch={dispatch}
        />
        <ChatFieldInput
          value={messageText}
          onChange={setMessageText}
          cleanOnEnter
          onEnter={handleSendMessage}
          maxLength={200}
          placeholder="Write a message"
          data-cy="chatInputField"
        />
        <SendIcon
          className="icon"
          role="button"
          data-cy="sendChat"
          onClick={handleSendMessage}
          sx={{ color: "#858585" }}
        />
      </div>
    </section>
  );
}
