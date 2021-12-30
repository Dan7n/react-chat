import React from "react";
import { BlurredBlobs } from "./../../styles/styled-components/BlurredBlobs";
import { ThreeScene } from "./ThreeScene";
import "./styles.scss";
import { motion } from "framer-motion";

export default function HomeComponent() {
  return (
    <div className="landing-page-container">
      {/* <BlurredBlobs></BlurredBlobs> */}
      <motion.div className="landing-page__hero-text">
        <h1>ReactChat</h1>
      </motion.div>
      <ThreeScene />
    </div>
  );
}
