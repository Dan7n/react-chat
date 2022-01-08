import React, { useState, useEffect, useCallback } from "react";
import { Autocomplete, Avatar, CircularProgress, Menu, MenuItem, TextField } from "@mui/material";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDebounce } from "./../../../hooks/useDebounce";

import {
  updateSearchValue,
  updateAutocompleteOpen,
  updateLoadingState,
  updateSearchUser,
  resetSearch,
} from "./../state/actionCreators";
import { IInitialState } from "../state/initialState";
import { checkEmailValid, checkPhoneNumberValid } from "./../../../utils/regexHelpers";
import { findUserByEmailOrPhoneNumber, createNewConversation } from "../../../utils/firebaseUserHelpers";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { getFirestore, collection, query, where, doc, orderBy } from "firebase/firestore";
import { auth, db } from "../../../firebase-config";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import { IconContainer } from "../../../styles/styled-components/IconContainer";
import { CreateConversationDialog } from "./CreateConversationDialog";

interface ISidePanel extends IInitialState {
  dispatch: React.Dispatch<any>;
  loggedInUser: any;
  isLargeDesktop: boolean;
}

interface IConversationUser {
  displayName: string;
  id: string;
  photoURL: string;
}

export const SidePanel = React.memo((props: ISidePanel) => {
  const { dispatch, searchValue, isAutocompleteOpen, isSearchLoading, searchUserFound, loggedInUser, isLargeDesktop } =
    props;
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const debouncedSearchValue = useDebounce(searchValue, 800);

  const createNewConversationProps = {
    searchValue,
    isAutocompleteOpen,
    isSearchLoading,
    searchUserFound,
    dispatch,
    isDialogOpen,
    setIsDialogOpen,
    loggedInUser,
  };

  const params = useParams();
  const navigateTo = useNavigate();

  const getNavigationLink = docId => {
    let navLink;
    if (isLargeDesktop) {
      params["*"] && params["*"]?.includes("profile")
        ? (navLink = `/chat/${docId}/profile`)
        : (navLink = `/chat/${docId}`);
    } else {
      params["*"] && params["*"]?.includes("settings")
        ? (navLink = `/chat/${docId}/settings`)
        : (navLink = `/chat/${docId}`);
    }

    return navLink;
  };

  //Get document reference to the currently logged in user
  const [userData] = useDocument(doc(db, "users", loggedInUser.uid));

  const getConversationsQuery = useCallback(() => {
    //only returns a valid query if the user has any conversations in their array of conversations
    if (userData) {
      const conversationsArray = userData.data()?.conversations;
      return conversationsArray.length > 0
        ? query(collection(db, "conversations"), where("__name__", "in", conversationsArray))
        : null;
    }
  }, [userData]);

  const [documentsData] = useCollection(getConversationsQuery());

  const conversations =
    documentsData &&
    documentsData.docs.map((doc, i) => {
      const conversation = doc.data().participants.find(participant => participant.id !== loggedInUser.uid);
      const messages = doc.data().messages;
      const lastSentMessage = messages && messages[messages.length - 1]?.text;
      const lastSentMediaFile = messages && messages[messages.length - 1]?.imageURL;
      let lastSentText;

      if (!messages.length) lastSentText = "No messages yet";
      else if (lastSentMessage) lastSentText = lastSentMessage;
      else if (lastSentMediaFile) lastSentText = "Media file";
      const isActiveConversation = params["*"] && params["*"].includes(doc.id);
      return (
        <motion.div
          key={i}
          className={`side-panel__single-conversation ${isActiveConversation && "active"}`}
          initial={{ opacity: 0, translateY: 60 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          onClick={() => navigateTo(getNavigationLink(doc.id))}>
          <div>
            <Avatar alt={conversation.displayName} src={conversation.photoURL} />
          </div>
          <div className="side-panel__single-conversation__text">
            <p>{conversation.displayName || "Unnamed user"}</p>
            <p>{lastSentText}</p>
          </div>
        </motion.div>
      );
    });

  return (
    <section className="side-panel">
      <div className="side-panel__mobile-header">
        <div>
          {/* <Avatar src={loggedInUser?.photoURL} alt={loggedInUser?.displayName} sx={{ width: 56, height: 56 }} /> */}
          <h1>Chats</h1>
        </div>
        <div>
          {!isLargeDesktop && (
            <>
              <IconContainer>
                <MoreVertIcon onClick={e => setAnchorEl(e.currentTarget)} />
              </IconContainer>
              <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={() => setAnchorEl(null)} className="menu-container">
                <MenuItem>
                  <Link
                    to={
                      params["*"]
                        ? `${params["*"]?.replace("/settings", "")?.replace("/profile", "")}/settings`
                        : "settings"
                    }>
                    Go to settings
                  </Link>
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>
      <CreateConversationDialog {...createNewConversationProps} />
      <motion.div className="side-panel__conversations-container">{conversations}</motion.div>
    </section>
  );
});
