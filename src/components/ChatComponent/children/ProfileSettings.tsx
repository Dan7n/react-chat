/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useContext } from "react";
import "./../../../styles/components/ChatComponent/styles.scss";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

//Context
import { GlobalContext, IContext } from "../../../context/GlobalContext";
import { logoutUser } from "../../../context/actionCreators";

//Components
import { Avatar } from "@mui/material";
import { RoundButton } from "./../../../styles/styled-components/RoundButton";
import { ProfilePage } from "../../AuthPage/profileComponents/ProfilePage";

//Firebase
import { getAuth, signOut, User } from "firebase/auth";

interface IProfileSettings {
  loggedInUser: User;
  isLargeDesktop: boolean;
}

export function ProfileSettings({ loggedInUser, isLargeDesktop }: IProfileSettings) {
  const auth = getAuth();
  const navigateTo = useNavigate();
  const { dispatch } = useContext<IContext>(GlobalContext);

  const handleSignOut = useCallback(() => {
    signOut(auth).then(() => {
      dispatch(logoutUser());
      navigateTo("/");
    });
  }, []);

  return (
    <section className="chat-container__profile">
      <AnimatePresence>
        <Routes>
          <Route
            path={isLargeDesktop ? "*" : "/"}
            element={
              <SettingsContainer
                loggedInUser={loggedInUser}
                handleSignOut={handleSignOut}
                isLargeDesktop={isLargeDesktop}
              />
            }
          />
          <Route path=":id/profile" element={<ProfilePage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Routes>
      </AnimatePresence>
    </section>
  );
}

interface IProfileContainer extends IProfileSettings {
  handleSignOut: () => void;
}

const SettingsContainer = ({ loggedInUser, handleSignOut, isLargeDesktop }: IProfileContainer) => {
  const location = useLocation();
  const navigateTo = useNavigate();

  const getNavLink = useMemo(() => {
    //returns the correct link to navigate to based on which route you're on, and whether or not you're surfing on a mobile device or desktop
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
        <RoundButton buttonText={"Logout"} bgColor={"#ff2768"} bgColorHover={"#c91e51"} onClick={handleSignOut} />
      </div>
    </motion.div>
  );
};
