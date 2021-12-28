import React, { useState, useEffect, useReducer } from "react";
import "./App.scss";
import "firebase/firestore";
import "firebase/auth";
import { firebaseApp, db, auth } from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

//------------- Component imports -------------
import HomeComponent from "./components/HomeComponent";
import LoginPage from "./components/LoginPage";

//------------- Context API -------------
import { GlobalContext } from "./context/GlobalContext";
import { defaultState, IDefaultState } from "./context/defaultState";
import { reducer } from "./context/reducer";
import { loginUser } from "./context/actionCreators";
import { IAction } from "./models/IAction";
import { ChatComponent } from "./components/ChatComponent";
import { ProfilePage } from "./components/ProfileComponent";

function App() {
  const [loggedInUser, loading, error] = useAuthState(auth);
  const [globalState, dispatch] = useReducer<React.Reducer<IDefaultState, IAction>>(reducer, defaultState);

  useEffect(() => {
    if (loggedInUser) dispatch(loginUser(loggedInUser));
  }, [loggedInUser]);

  return (
    <>
      <Toaster />
      <GlobalContext.Provider value={{ state: globalState, dispatch: dispatch }}>
        <Routes>
          <Route path="auth" element={<LoginPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="chat" element={<ChatComponent />} />
          <Route path="/" element={<HomeComponent />} />
          <Route path="*" element={<h1>Not found</h1>} />
        </Routes>
      </GlobalContext.Provider>
    </>
  );
}

export default App;
