import React, { useCallback } from "react";
import { BlurredBlobs } from "./../../styles/styled-components/BlurredBlobs";
import { ThreeScene } from "./ThreeScene";
import "./styles.scss";
import { motion, AnimatePresence } from "framer-motion";
import { ReactComponent as Wave } from "./../../assets/wave.svg";
import { RoundButton } from "../../styles/styled-components/RoundButton";
import { useNavigate } from "react-router-dom";

export default function HomeComponent() {
  const navigateTo = useNavigate();
  const handleClick = useCallback(() => {
    navigateTo("auth/login");
  }, []);

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
            buttonText="Create an account - it's free!"
            width="clamp(30vw, 80vw, 26rem);"
            bgColor="#111D5E"
            bgColorHover="#9567BE"
            onClick={handleClick}
          />
        </motion.div>
        <ThreeScene />
        <div>Some content here</div>
        {/* <Wave className="wave" /> */}
      </motion.div>
    </AnimatePresence>
  );
}
