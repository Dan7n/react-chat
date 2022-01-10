import React, { useReducer, useContext, useState, useEffect } from "react";

import { SidePanel } from "./children/SidePanel";
import { MessagesPanel } from "./children/MessagesPanel";
import "./../../styles/components/ChatComponent/styles.scss";
import { ProfileSettings } from "./children/ProfileSettings";

import { reducer } from "./state/reducer";
import { initialState } from "./state/initialState";
import { GlobalContext } from "../../context/GlobalContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase-config";
import { ScaleLoader } from "react-spinners";
import { Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import useMediaQuery from "@mui/material/useMediaQuery";
import { NoConversationSelected } from "./children/NoConversationSelected";

export const ChatComponent = React.memo(() => {
  const [chatState, chatDispatch] = useReducer(reducer, initialState);
  const [loggedInUser] = useAuthState(auth);
  const isDesktop = useMediaQuery("(min-width:640px)");
  const isLargeDesktop = useMediaQuery("(min-width:1000px)");

  const sidePanelProps = {
    dispatch: chatDispatch,
    searchValue: chatState.searchValue,
    isAutocompleteOpen: chatState.isAutocompleteOpen,
    isSearchLoading: chatState.isSearchLoading,
    loggedInUser: loggedInUser,
    isLargeDesktop: isLargeDesktop,
  };

  return (
    <main className="chat-container">
      {loggedInUser ? (
        <section className="chat-container__body">
          {isDesktop && <SidePanel {...sidePanelProps} />}
          <Routes>
            {/* Second panel will either show the messages component (or an empty state prompting the user to select a message), 
            or the profile component on smaller screens */}
            {isDesktop && <Route path="*" element={<NoConversationSelected />} />}

            {/* Same component <ProfileSettings /> mathes two seperate paths */}
            {!isLargeDesktop && (
              <>
                <Route
                  path="/settings/*"
                  element={<ProfileSettings loggedInUser={loggedInUser} isLargeDesktop={isLargeDesktop} />}
                />
                <Route
                  path=":documentId/settings/*"
                  element={<ProfileSettings loggedInUser={loggedInUser} isLargeDesktop={isLargeDesktop} />}
                />
              </>
            )}

            {!isDesktop && <Route path="*" element={<SidePanel {...sidePanelProps} />} />}
            {isLargeDesktop && <Route path="/profile" element={<NoConversationSelected />} />}
            <Route
              path={isLargeDesktop ? ":documentId/*" : ":documentId"}
              element={
                <motion.div
                  initial={{ opacity: 0, translateX: 50 }}
                  animate={{ translateX: 0, opacity: 1 }}
                  className="messages-container">
                  <MessagesPanel loggedInUser={loggedInUser} />
                </motion.div>
              }
            />
          </Routes>
          {/* And lastly the third section all the way to the right will show the profile component but only on larger screens */}
          {isLargeDesktop && <ProfileSettings loggedInUser={loggedInUser} isLargeDesktop={isLargeDesktop} />}
        </section>
      ) : (
        <div className="loader">
          <ScaleLoader color="#6246ea" height="5rem" width="0.5rem" />
        </div>
      )}
    </main>
  );
});
