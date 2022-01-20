import React, { useRef, useEffect } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import done from "../../../assets/done.json";
import { motion } from "framer-motion";

export const LoggedInTrue = React.memo(() => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    //For some odd reason the animation plays twice wven with loop and autoplay set to false, so I'm pausing it manually here after 2s
    const timeout = setTimeout(() => {
      animationRef?.current!.pause();
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  console.log("rendered");
  return (
    <motion.div className="login-successfull">
      <motion.p
        initial={{ translateY: 90, opacity: 0, scale: 0.3 }}
        animate={{ translateY: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}>
        You're all set!
      </motion.p>
      <Lottie
        lottieRef={animationRef}
        animationData={done}
        autoPlay={false}
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        loop={false}
        container={containerRef?.current!}
        className="login-successfull__lottie"
      />
    </motion.div>
  );
});
