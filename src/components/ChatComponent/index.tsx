import React, { useReducer } from "react";
import { reducer } from "./state/reducer";
import { initialState } from "./state/initialState";
import "./../../styles/components/ChatComponent/styles.scss";
import { Route, Routes, useLocation } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import useMediaQuery from "@mui/material/useMediaQuery";

//Children & other components
import { SidePanel } from "./children/SidePanel";
import { MessagesPanel } from "./children/MessagesPanel";
import { ProfileSettings } from "./children/ProfileSettings";
import { NoConversationSelected } from "./children/NoConversationSelected";
import { ScaleLoader } from "react-spinners";
import Backdrop from "@mui/material/Backdrop";

//Firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase-config";

export const ChatComponent = React.memo(() => {
  const [chatState, chatDispatch] = useReducer(reducer, initialState);
  const [loggedInUser] = useAuthState(auth);
  const isDesktop = useMediaQuery("(min-width:640px)");
  const isLargeDesktop = useMediaQuery("(min-width:1000px)");
  const location = useLocation();

  const sidePanelProps = {
    dispatch: chatDispatch,
    searchValue: chatState.searchValue,
    isAutocompleteOpen: chatState.isAutocompleteOpen,
    isSearchLoading: chatState.isSearchLoading,
    loggedInUser: loggedInUser!,
    isLargeDesktop: isLargeDesktop,
  };

  const profileVarients: Variants = {
    exit: { translateY: 90, opacity: 0 },
    initial: { opacity: 0, translateY: 150 },
    animate: { opacity: 1, translateY: 0 },
  };

  return (
    <main className="chat-container">
      {loggedInUser && (
        <section className="chat-container__body">
          {isDesktop && <SidePanel {...sidePanelProps} />}
          <AnimatePresence exitBeforeEnter>
            <Routes location={location} key={location.pathname}>
              {/* Second panel will either show the messages component (or an empty state prompting the user to select a message), 
            or the profile component on smaller screens */}
              {isDesktop && <Route path="*" element={<NoConversationSelected />} />}

              {/* Same component <ProfileSettings /> mathes two seperate paths */}
              {!isLargeDesktop && (
                <>
                  <Route
                    path="/settings/*"
                    element={
                      <motion.div
                        variants={profileVarients}
                        exit="exit"
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.4 }}>
                        <ProfileSettings loggedInUser={loggedInUser} isLargeDesktop={isLargeDesktop} />
                      </motion.div>
                    }
                  />
                  <Route
                    path=":documentId/settings/*"
                    element={
                      <motion.div
                        variants={profileVarients}
                        exit="exit"
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.4 }}>
                        <ProfileSettings loggedInUser={loggedInUser} isLargeDesktop={isLargeDesktop} />
                      </motion.div>
                    }
                  />
                </>
              )}

              {!isDesktop && (
                <Route
                  path="*"
                  element={
                    <motion.div
                      exit={{ translateX: -90, opacity: 0 }}
                      initial={{ opacity: 0, translateX: -150 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{ duration: 0.4 }}>
                      <SidePanel {...sidePanelProps} />
                    </motion.div>
                  }
                />
              )}
              {isLargeDesktop && <Route path="/profile" element={<NoConversationSelected />} />}
              <Route
                path={isLargeDesktop ? ":documentId/*" : ":documentId"}
                element={
                  <motion.div
                    exit={{ translateX: 90, opacity: 0 }}
                    initial={{ opacity: 0, translateX: 50 }}
                    animate={{ translateX: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="messages-container">
                    <MessagesPanel loggedInUser={loggedInUser} dispatch={chatDispatch} />
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
          {/* And lastly the third section all the way to the right will show the profile component but only on larger screens */}
          {isLargeDesktop && <ProfileSettings loggedInUser={loggedInUser} isLargeDesktop={isLargeDesktop} />}
        </section>
      )}

      <Backdrop open={Boolean(!loggedInUser) || chatState?.isMessagesLoading!} sx={{ zIndex: 100 }}>
        <ScaleLoader color="#fff" height="5rem" width="0.5rem" />
      </Backdrop>
    </main>
  );
});
