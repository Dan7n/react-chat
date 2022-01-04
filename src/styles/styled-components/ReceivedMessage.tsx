import { motion } from "framer-motion";
import styled from "styled-components";

const ReceivedBubble = styled(motion.div)`
  position: relative;
  padding: 7px 20px;
  border-radius: 25px;
  background: #e5e5ea;
  color: black;

  //TODO fix this
  &:img:first-of-type {
    background-color: red !important;
    max-width: 30%;
    max-height: 30%;
  }

  &:before {
    content: "";
    position: absolute;
    z-index: 2;
    bottom: -2px;
    left: -7px;
    height: 20px;
    border-left: 20px solid #e5e5ea;
    border-bottom-right-radius: 16px 14px;
    transform: translate(0, -2px);
  }
  &:after {
    content: "";
    position: absolute;
    z-index: 3;
    bottom: -2px;
    left: 4px;
    width: 26px;
    height: 20px;
    background: var(--chat-main-bg);
    border-bottom-right-radius: 10px;
    transform: translate(-30px, -2px);
  }
`;

export const ReceivedMessage = ({ children, i }) => {
  return (
    <ReceivedBubble
      initial={{ opacity: 0, translateY: 60 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: i * 0.04 }}>
      {children}
    </ReceivedBubble>
  );
};
