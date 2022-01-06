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
import { getFirestore, collection, query, where, doc } from "firebase/firestore";
import { auth, db } from "../../../firebase-config";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import { IconContainer } from "../../../styles/styled-components/IconContainer";

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
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<IConversationUser[] | []>([]);
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const debouncedSearchValue = useDebounce(searchValue, 800);

  const params = useParams();
  const navigateTo = useNavigate();

  const getNavigationLink = docId => {
    let navLink;
    if (isLargeDesktop) {
      params["*"] && params["*"]?.includes("profile") ? (navLink = `/chat/${docId}/profile`) : navLink`/chat/${docId}`;
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

  useEffect(() => {
    if (debouncedSearchValue.length) {
      const isInputValidPhoneNumber = checkPhoneNumberValid(debouncedSearchValue);
      const isInputValidEmail = checkEmailValid(debouncedSearchValue);
      const queryType = isInputValidPhoneNumber ? "phoneNumber" : "email";

      //   if (!isInputValidPhoneNumber && !isInputValidEmail) {
      //     return alert("Please make sure you typed in a correct phone number or email adress");
      //   }

      findUserByEmailOrPhoneNumber(queryType, debouncedSearchValue).then(res => {
        const { foundUser } = res;
        if (foundUser) {
          setAutoCompleteOptions([
            { displayName: foundUser!.displayName || "Unnamed user", id: foundUser.id, photoURL: foundUser.photoURL },
          ]);
        }
      });
    }
  }, [debouncedSearchValue]);

  const startNewConversation = useCallback(
    async (conversationPartnerId: IConversationUser) => {
      if (loggedInUser) {
        createNewConversation(loggedInUser, conversationPartnerId);
      }
    },
    [autoCompleteOptions, setAutoCompleteOptions]
  );

  return (
    <section className="side-panel">
      <div className="side-panel__mobile-header">
        <div>
          <Avatar src={loggedInUser?.photoURL} alt={loggedInUser?.displayName} sx={{ width: 56, height: 56 }} />
          <h1>Chats</h1>
        </div>
        <div>
          <IconContainer>
            <MoreVertIcon onClick={e => setAnchorEl(e.currentTarget)} />
          </IconContainer>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={() => setAnchorEl(null)} className="menu-container">
            <MenuItem>
              <Link to={params["*"] ? `${params["*"]?.replace("/settings", "")}/settings` : "settings"}>
                Go to settings
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <Autocomplete
        open={isAutocompleteOpen}
        onOpen={() => {
          dispatch(updateAutocompleteOpen(true));
        }}
        onClose={() => {
          dispatch(updateAutocompleteOpen(false));
        }}
        filterOptions={option => option}
        onChange={(e, newVal) => {
          if (newVal) startNewConversation(newVal);
        }}
        onInputChange={(e, newVal) => dispatch(updateSearchValue(newVal))}
        getOptionLabel={(option: any) => option.displayName}
        options={autoCompleteOptions}
        loading={isSearchLoading}
        renderInput={params => (
          <TextField
            {...params}
            placeholder="Find a user by email or phone number"
            value={searchValue}
            sx={{ padding: "1rem 20px", borderRadius: "10px" }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      <motion.div className="side-panel__conversations-container">{conversations}</motion.div>
    </section>
  );
});
