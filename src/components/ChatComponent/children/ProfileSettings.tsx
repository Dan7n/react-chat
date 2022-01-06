/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, useMemo } from "react";
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

  useEffect(() => {
    console.log(isLargeDesktop);
  }, [isLargeDesktop]);

  const handleSignOut = useCallback(() => {
    signOut(auth).then(() => {
      navigateTo("/");
    });
  }, []);

  return (
    <section className="chat-container__profile">
      <AnimatePresence>
        <Routes>
          {isLargeDesktop ? (
            <Route
              path="*"
              element={
                <SettingsContainer
                  loggedInUser={loggedInUser}
                  handleSignOut={handleSignOut}
                  isLargeDesktop={isLargeDesktop}
                />
              }
            />
          ) : (
            <Route
              path="/"
              element={
                <SettingsContainer
                  loggedInUser={loggedInUser}
                  handleSignOut={handleSignOut}
                  isLargeDesktop={isLargeDesktop}
                />
              }
            />
          )}
          <Route path=":id/profile" element={<ProfilePage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Routes>
      </AnimatePresence>
    </section>
  );
}

const SettingsContainer = ({ loggedInUser, handleSignOut, isLargeDesktop }) => {
  const location = useLocation();
  const navigateTo = useNavigate();

  const getNavLink = useMemo(() => {
    let navLink;
    if (isLargeDesktop) {
      location.pathname.includes("/settings")
        ? (navLink = location.pathname.replace("/settings", "/profile"))
        : (navLink = location.pathname + "/profile");
    } else {
      location.pathname.includes("/settings")
        ? (navLink = location.pathname + "/profile")
        : (navLink = location.pathname + "/settings/profile");
    }
    return navLink;
  }, [location.pathname, isLargeDesktop]);

  return (
    <motion.div className="chat-container__profile__inner">
      <Avatar src={loggedInUser?.photoURL!} alt={loggedInUser?.displayName!} sx={{ width: 140, height: 140 }} />
      <div className="buttons-container">
        <RoundButton buttonText={"Profile settings"} onClick={() => navigateTo(getNavLink)} />
        <RoundButton buttonText={"Logout"} bgColor={"#e54a57"} bgColorHover={"#d31e2d"} onClick={handleSignOut} />
      </div>
    </motion.div>
  );
};
