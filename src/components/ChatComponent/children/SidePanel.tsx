import React, { useState, useCallback, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { IInitialState } from "../state/initialState";
import { motion } from "framer-motion";
import { IAction } from "../../../models/IAction";

//Components
import { Avatar, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconContainer } from "../../../styles/styled-components/IconContainer";
import { CreateConversationDialog } from "./SidePanelChildren/CreateConversationDialog";

//Firebase
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, query, where, doc, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { User } from "@firebase/auth";

const getRandomGradient = () => {
  const randomNum = () => Math.floor(Math.random() * 10) + 1;
  return `gradient${randomNum()}`;
};

interface ISidePanel extends IInitialState {
  dispatch: React.Dispatch<IAction>;
  loggedInUser: User;
  isLargeDesktop: boolean;
}

export const SidePanel = React.memo(
  ({ dispatch, searchValue, isAutocompleteOpen, isSearchLoading, loggedInUser, isLargeDesktop }: ISidePanel) => {
    //Local state
    const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isMenuOpen = Boolean(anchorEl);
    const params = useParams();
    const navigateTo = useNavigate();

    //Get document reference to the currently logged in user
    const [userData] = useDocument(doc(db, "users", loggedInUser.uid));

    //Returns either a valid query to get all conversations in the user document's "conversation" array, or null if the user hasn't created any conversations yet
    //Without this function the useCollection hook throws an error if the user doesn't have any conversations
    const getConversationsQuery = useCallback(() => {
      if (userData) {
        const conversationsArray = userData.data()?.conversations;
        return conversationsArray.length > 0
          ? query(collection(db, "conversations"), where("__name__", "in", conversationsArray))
          : null;
      }
    }, [userData]);
    const [documentsData] = useCollection(getConversationsQuery());

    const createNewConversationProps = {
      searchValue,
      isAutocompleteOpen,
      isSearchLoading,
      dispatch,
      isDialogOpen,
      setIsDialogOpen,
      loggedInUser,
      documentsData,
    };

    const getNavigationLink = docId => {
      let navLink;
      if (isLargeDesktop) {
        params["*"] && params["*"]?.includes("profile")
          ? (navLink = `/chat/${docId}/profile`)
          : (navLink = `/chat/${docId}`);
      } else {
        navLink = `/chat/${docId}`;
      }
      return navLink;
    };

    const conversations = useMemo(() => {
      if (!documentsData) return;

      //sort array by date
      const orderedList: QueryDocumentSnapshot<DocumentData>[] = documentsData.docs.sort((a, b) => {
        const date1 = a.data()?.lastUpdated?.toDate();
        const date2 = b.data()?.lastUpdated?.toDate();
        return date2 - date1;
      });

      //iterate and render JSX elements
      return orderedList.map((doc, i) => {
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
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            layout
            onClick={() => navigateTo(getNavigationLink(doc.id))}>
            <div className="avatar-container">
              <Avatar alt={conversation.displayName} src={conversation.photoURL || ""} className="side-panel__avatar" />
              <ColorfulBorder />
            </div>
            <div className="side-panel__single-conversation__text">
              <p>{conversation.displayName || "Unnamed user"}</p>
              <p>{lastSentText}</p>
            </div>
          </motion.div>
        );
      });
    }, [documentsData, params, loggedInUser.uid]);

    return (
      <section className="side-panel">
        <div className="side-panel__mobile-header">
          <div>
            <h1>Chats</h1>
          </div>
          <div>
            {!isLargeDesktop && (
              <>
                <IconContainer>
                  <MoreVertIcon onClick={e => setAnchorEl(e.currentTarget)} />
                </IconContainer>
                <Menu
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={() => setAnchorEl(null)}
                  className="menu-container">
                  <MenuItem>
                    <Link to="/chat/settings">Go to settings</Link>
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
  }
);

const ColorfulBorder = React.memo(() => {
  //momoized component to aviod changing the grandient color every time SidePanel re-renders when the user clicks on something
  return <div className={`gradient-border ${getRandomGradient()}`}></div>;
});
