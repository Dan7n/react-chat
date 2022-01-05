import React from "react";
import { BlurredBlobs } from "./../../styles/styled-components/BlurredBlobs";
import { ThreeScene } from "./ThreeScene";
import "./styles.scss";
import { motion } from "framer-motion";
import { ReactComponent as Wave } from "./../../assets/wave.svg";
import { RoundButton } from "../../styles/styled-components/RoundButton";

export default function HomeComponent() {
  return (
    <motion.div
      className="landing-page-container"
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.2 }}>
      {/* <BlurredBlobs></BlurredBlobs> */}
      <motion.div className="landing-page__hero-text">
        <h1>ReactChat</h1>
        <p>Chat with friends and family all over the globe, create new memories and stay connected.</p>
        <RoundButton
          buttonText="Create an account - it's free!"
          width="clamp(30vw, 80vw, 26rem);"
          bgColor="#111D5E"
          bgColorHover="#9567BE"
        />
      </motion.div>
      <ThreeScene />
      <div>Some content here</div>
      {/* <Wave className="wave" /> */}
    </motion.div>
  );
}
