import React, { useState, useEffect } from "react";
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

function App() {
  const [loggedInUser, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loggedInUser) console.log({ loggedInUser });
  }, [loggedInUser]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="account/auth" element={<LoginPage />} />
        <Route path="/" element={<HomeComponent />} />
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </>
  );
}

export default App;
