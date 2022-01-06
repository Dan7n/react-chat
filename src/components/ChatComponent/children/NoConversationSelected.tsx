import { motion } from "framer-motion";

export const NoConversationSelected = () => {
  return (
    <motion.div
      initial={{ translateY: -80, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeIn" }}
      className="no-conversation-selected">
      <ArrowSvg />
      <h1>Select a conversation from the left panel to get started</h1>
    </motion.div>
  );
};

const ArrowSvg = () => {
  return (
    <svg
      width="506"
      height="443"
      viewBox="0 0 506 443"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="arrow-svg">
      <path
        d="M500.24 2.59033C508.515 42.4109 503.038 75.1946 484.619 111.412C460.364 159.104 422.245 205.459 374.209 230.03C345.705 244.609 298.683 265.8 267.77 248.034C242.871 233.724 241.839 194.681 247.78 169.926C251.468 154.56 264.311 138.224 279.817 152.054C313.111 181.748 297.745 235.606 281.274 269.746C244.615 345.728 200 393.5 97.5 398C88.6378 399.329 -7.4989 396.371 3.49996 393.5"
        stroke="black"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        id="path1"
      />
      <path
        d="M89 374.5C84.1164 378.39 -1.10935 390.389 2.50117 394C16.2518 407.751 68.8793 432.036 76.5012 441"
        stroke="black"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        id="path2"
      />
    </svg>
  );
};
