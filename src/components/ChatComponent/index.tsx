import React, { useReducer, useContext, useState, useEffect } from "react";

import { SidePanel } from "./children/SidePanel";
import { MessagesPanel } from "./children/MessagesPanel";
import "./styles.scss";
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

export const ChatComponent = React.memo(() => {
  const [chatState, chatDispatch] = useReducer(reducer, initialState);
  const [loggedInUser] = useAuthState(auth);
  const isDesktop = useMediaQuery("(min-width:640px)");

  const sidePanelProps = {
    dispatch: chatDispatch,
    searchValue: chatState.searchValue,
    isAutocompleteOpen: chatState.isAutocompleteOpen,
    isSearchLoading: chatState.isSearchLoading,
    searchUserFound: chatState.searchUserFound,
    loggedInUser: loggedInUser,
  };

  return (
    <main className="chat-container">
      {loggedInUser ? (
        <section className="chat-container__body">
          {isDesktop && <SidePanel {...sidePanelProps} />}
          <Routes>
            <Route path="*" element={<h2>Click on a conversation to get started</h2>} />
            {!isDesktop && <Route path="*" element={<SidePanel {...sidePanelProps} />} />}
            <Route
              path=":documentId/*"
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
          <ProfileSettings loggedInUser={loggedInUser} />
        </section>
      ) : (
        <div className="loader">
          <ScaleLoader color="#6246ea" height="5rem" width="0.5rem" />
        </div>
      )}
    </main>
  );
});
