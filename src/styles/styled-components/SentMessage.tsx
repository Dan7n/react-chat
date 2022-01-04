import { motion } from "framer-motion";
import styled from "styled-components";

const SentBubble = styled(motion.div)`
  position: relative;
  padding: 7px 20px;
  border-radius: 25px;
  color: white;
  background: var(--app-main-color);
  &::before {
    content: "";
    position: absolute;
    z-index: 1;
    bottom: -2px;
    right: -7px;
    height: 20px;
    border-right: 20px solid var(--app-main-color);
    border-bottom-left-radius: 16px 14px;
    transform: translate(0, -2px);
  }
  &:after {
    content: "";
    position: absolute;
    z-index: 1;
    bottom: -2px;
    right: -56px;
    width: 26px;
    height: 20px;
    background: var(--chat-main-bg);
    border-bottom-left-radius: 10px;
    transform: translate(-30px, -2px);
  }
`;

export const SentMessage = ({ children, i }) => {
  return (
    <SentBubble
      initial={{ opacity: 0, translateY: 60 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: i * 0.1 }}>
      {children}
    </SentBubble>
  );
};
