import React, { useRef } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import reactLogo from "./../../../assets/reactLogo.json";
import { GoBackBtn } from "./../../../styles/styled-components/GoBackBtn";

export const SidePanel = React.memo(() => {
  const containerRef = useRef<Element | null>(null);

  return (
    <motion.div className="auth__sidePanel-container">
      <GoBackBtn to="/" btnText="Back to Homepage" color="#03a5d0" />
      <Lottie animationData={reactLogo} container={containerRef?.current!} loop className="lottie-animation" />
      <motion.h1
        initial={{ opacity: 0, translateY: 200, scale: 1.3 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          type: "spring",
          damping: 10,
          mass: 0.75,
          stiffness: 150,
          duration: 1.3,
        }}>
        ReactChat
      </motion.h1>
    </motion.div>
  );
});
