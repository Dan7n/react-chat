import { motion } from "framer-motion";
import React from "react";
import { BlurredBlobs } from "../../../styles/styled-components/BlurredBlobs";
import noImgSrc from "./../../../assets/no-messages.png";

const NoMessages = () => {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 60 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3 }}>
      <BlurredBlobs>
        <motion.div className="no-messages">
          <img src={noImgSrc} alt="lady flying on a space rocket" />
          <h1>No messages yet. Start typing and send your first message using the text field down below!</h1>
        </motion.div>
      </BlurredBlobs>
    </motion.div>
  );
};

export default React.memo(NoMessages);
