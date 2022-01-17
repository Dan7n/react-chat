import React, { useCallback, useContext, useEffect } from "react";
import { ThreeScene } from "./ThreeScene";
import "./../../styles/components/HomeComponent/styles.scss";
import { motion, AnimatePresence } from "framer-motion";
import { ReactComponent as Wave } from "./../../assets/wave.svg";
import { RoundButton } from "../../styles/styled-components/RoundButton";
import { useNavigate } from "react-router-dom";
import { GlobalContext, IContext } from "../../context/GlobalContext";
import { handleLoggedInUserNotification } from "../../utils/toastHelpers";
import { Waves } from "./children/Waves";
import firstContent from "./../../assets/firstContent.png";
import secondContent from "./../../assets/secondContent.png";
import thirdContent from "./../../assets/thirdContent.png";

export default function HomeComponent() {
  const { state } = useContext<IContext>(GlobalContext);
  const navigateTo = useNavigate();

  const handleClick = useCallback(() => {
    state?.user ? navigateTo("/chat") : navigateTo("auth/login");
  }, [state.user]);

  useEffect(() => {
    if (state?.user) {
      handleLoggedInUserNotification(state.user.email!);
    }
  }, [state.user]);

  return (
    <AnimatePresence>
      <motion.div
        className="landing-page-container"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.2 }}
        exit={{ opacity: 0, translateY: -50 }}>
        {/* <BlurredBlobs></BlurredBlobs> */}
        <motion.div
          className="landing-page__hero-text"
          animate={{ opacity: 1, translateY: 0 }}
          initial={{ opacity: 0, translateY: 120 }}
          transition={{ delay: 1, duration: 1.35 }}>
          <h1>ReactChat</h1>
          <p>Chat with friends and family all over the globe, create new memories and stay connected.</p>
          <RoundButton
            buttonText={state?.user ? "Start chatting now!" : "Create an account - it's free!"}
            width="clamp(30vw, 80vw, 26rem);"
            bgColor="#111D5E"
            bgColorHover="#9567BE"
            onClick={handleClick}
            data-cy="landingPageRedirect"
          />
        </motion.div>
        <ThreeScene />
        <section className="landing-page__content">
          <Waves />

          <motion.div
            className="landing-page__content__header"
            viewport={{ once: true }}
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.4 }}
            transition={{ type: "spring", stiffness: 80, mass: 2, bounce: 0.2 }}>
            <h1>Keep in touch with family and friends, from anywhere, anytime!</h1>
            <div className="header-text">
              <p>
                ReactChat makes it super simple and lighning fast to connect with your loved ones. Simply create a free
                account in seconds and you'll be on your way to creating new memories
              </p>
            </div>
          </motion.div>

          <motion.div
            className="landing-page__content__section"
            viewport={{ once: true }}
            whileInView={{ opacity: 1, translateX: 0 }}
            initial={{ opacity: 0, translateX: -300 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}>
            <div className="text">
              <h1>Send and receive messages instantly 🔥</h1>
              <p>
                Send instant messages and get instant replies, all updated in real time with the power of Google
                Firebase
              </p>
            </div>
            <img src={firstContent} alt="mobile render of the chat page" />
          </motion.div>

          <motion.div
            className="landing-page__content__section reverse"
            viewport={{ once: true }}
            whileInView={{ opacity: 1, translateX: 0 }}
            initial={{ opacity: 0, translateX: 300 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}>
            <div className="text">
              <h1>Send and receive media files and audio clips just as easily! 📱</h1>
              <p>
                Why limit your self to just text when an image can say a thousand words? Send cute cat pics, memes, or
                whatever else with ReactChat!
              </p>
            </div>
            <img src={secondContent} alt="mobile render of the chat page showing that users can send images" />
          </motion.div>

          <motion.div
            className="landing-page__content__section"
            viewport={{ once: true }}
            whileInView={{ opacity: 1, translateX: 0 }}
            initial={{ opacity: 0, translateX: -300 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}>
            <div className="text">
              <h1>Create an account and login safely in seconds! 🔐</h1>
              <p>
                It only takes a few seconds to create a ReactChat account - login is safe and secure and uses either
                traditional email/password authentication, or login via Google Auth Provider
              </p>
            </div>
            <img
              src={thirdContent}
              alt="mobile render of login page, showing that the user can login using email/password or Google auth provider"
            />
          </motion.div>
          <Waves />
        </section>
      </motion.div>
    </AnimatePresence>
  );
}
