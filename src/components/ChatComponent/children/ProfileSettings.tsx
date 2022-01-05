import { useState, useCallback } from "react";
import "./../styles.scss";
import { Avatar, CircularProgress } from "@mui/material";
import { RoundButton } from "./../../../styles/styled-components/RoundButton";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export function ProfileSettings({ loggedInUser }) {
  const auth = getAuth();
  const navigateTo = useNavigate();

  const handleSignOut = useCallback(() => {
    signOut(auth).then(() => {
      navigateTo("/");
    });
  }, []);

  console.log(auth);
  return (
    <section className="chat-container__profile">
      <Avatar src={loggedInUser.photoURL} alt={loggedInUser?.displayName} sx={{ width: 140, height: 140 }} />
      <div className="buttons-container">
        <RoundButton buttonText={"Profile settings"} />
        <RoundButton buttonText={"Logout"} bgColor={"#e54a57"} bgColorHover={"#d31e2d"} onClick={handleSignOut} />
      </div>
    </section>
  );
}
