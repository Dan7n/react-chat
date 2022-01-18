import React, { useEffect, useReducer } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

//------------- Firebase -------------
import "firebase/firestore";
import "firebase/auth";
import { auth } from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

//------------- Component imports -------------
import HomeComponent from "./components/HomeComponent";
import AuthPage from "./components/AuthPage";
import { ChatComponent } from "./components/ChatComponent";
import { Toaster } from "react-hot-toast";

//------------- Context API -------------
import { GlobalContext } from "./context/GlobalContext";
import { defaultState, IDefaultState } from "./context/defaultState";
import { reducer } from "./context/reducer";
import { loginUser } from "./context/actionCreators";
import { IAction } from "./models/IAction";
import { NotFound } from "./components/404/NotFound";

function App() {
  const [loggedInUser] = useAuthState(auth);
  const [globalState, dispatch] = useReducer<React.Reducer<IDefaultState, IAction>>(reducer, defaultState);
  const location = useLocation();

  useEffect(() => {
    if (loggedInUser && !globalState.user) dispatch(loginUser(loggedInUser));
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* </AnimatePresence> */}
      </GlobalContext.Provider>
    </>
  );
}

export default App;
