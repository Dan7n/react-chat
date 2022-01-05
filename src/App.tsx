import React, { useState, useEffect, useReducer } from "react";
import "firebase/firestore";
import "firebase/auth";
import { firebaseApp, db, auth } from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

//------------- Component imports -------------
import HomeComponent from "./components/HomeComponent";
import AuthPage from "./components/AuthPage";

//------------- Context API -------------
import { GlobalContext } from "./context/GlobalContext";
import { defaultState, IDefaultState } from "./context/defaultState";
import { reducer } from "./context/reducer";
import { loginUser } from "./context/actionCreators";
import { IAction } from "./models/IAction";
import { ChatComponent } from "./components/ChatComponent";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const [loggedInUser, loading, error] = useAuthState(auth);
  const [globalState, dispatch] = useReducer<React.Reducer<IDefaultState, IAction>>(reducer, defaultState);
  const location = useLocation();

  useEffect(() => {
    if (loggedInUser) dispatch(loginUser(loggedInUser));
  }, [loggedInUser]);

  return (
    <>
      <Toaster />
      <GlobalContext.Provider value={{ state: globalState, dispatch: dispatch }}>
        {/* <AnimatePresence> */}
        <Routes>
          <Route path="auth/*" element={<AuthPage />} />
          <Route path="chat/*" element={<ChatComponent />} />
          <Route
            path="/"
            element={
              <motion.div transition={{ ease: "backOut", duration: 1 }} exit={{ opacity: 0, translateY: -50 }}>
                <HomeComponent />
              </motion.div>
            }
          />
          <Route path="*" element={<h1>Not found</h1>} />
        </Routes>
        {/* </AnimatePresence> */}
      </GlobalContext.Provider>
    </>
  );
}

export default App;
