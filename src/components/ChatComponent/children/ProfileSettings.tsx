/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from "react";
import "./../styles.scss";
import { Avatar, CircularProgress } from "@mui/material";
import { RoundButton } from "./../../../styles/styled-components/RoundButton";
import { getAuth, signOut, User } from "firebase/auth";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { ProfilePage } from "../../AuthPage/profileComponents/ProfilePage";

/**
 * 
 initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
 */

interface IProfileSettings {
  loggedInUser: User;
  isLargeDesktop: boolean;
}

export function ProfileSettings({ loggedInUser, isLargeDesktop }: IProfileSettings) {
  const auth = getAuth();
  const navigateTo = useNavigate();
  const location = useLocation();

  const handleSignOut = useCallback(() => {
    signOut(auth).then(() => {
      navigateTo("/");
    });
  }, []);

  const handleProfileSettings = useCallback(() => {
    console.log(location.pathname);
    navigateTo(location.pathname + "/profile");
  }, [location.pathname]);

  return (
    <section className="chat-container__profile">
      <AnimatePresence>
        <Routes>
          <Route
            path="*"
            element={
              <motion.div className="chat-container__profile__inner">
                <Avatar
                  src={loggedInUser?.photoURL!}
                  alt={loggedInUser?.displayName!}
                  sx={{ width: 140, height: 140 }}
                />
                <div className="buttons-container">
                  <RoundButton buttonText={"Profile settings"} onClick={handleProfileSettings} />
                  <RoundButton
                    buttonText={"Logout"}
                    bgColor={"#e54a57"}
                    bgColorHover={"#d31e2d"}
                    onClick={handleSignOut}
                  />
                </div>
              </motion.div>
            }
          />
          <Route path=":id/profile" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </AnimatePresence>
    </section>
  );
}
