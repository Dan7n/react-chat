import Lottie from "lottie-react";
import lottie404 from "../../assets/404.json";
import "./../../styles/components/404/style.scss";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const NotFound = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="lottie-container"
        initial={{ opacity: 0, translateY: 150, scale: 1.8 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ duration: 2, type: "spring", stiffness: 100 }}
        key="notFoundComponent"
        exit={{ opacity: 0, scale: 0 }}>
        <h1>We're really trying, but we can't seem to find the page you're looking for!</h1>
        <Link to="/" className="nav-link">
          Go back to the homepage
        </Link>
        <Lottie animationData={lottie404} loop={true} className="animation" />
      </motion.div>
    </AnimatePresence>
  );
};
