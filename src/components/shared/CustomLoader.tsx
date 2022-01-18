import Backdrop from "@mui/material/Backdrop";
import Lottie from "lottie-react";
import loader from "./../../assets/loader.json";
import { useRef } from "react";

interface ILoaderProps {
  isVisible: boolean;
}

/**
 *
 * @param isVisible: boolean indicating whether or not the loader is visible
 */

export const CustomLoader = ({ isVisible }: ILoaderProps) => {
  const containerRef = useRef<Element | null>(null);

  return (
    <Backdrop open={isVisible} sx={{ zIndex: 100, color: "#fff" }} ref={containerRef}>
      <Lottie
        animationData={loader}
        loop={true}
        container={containerRef?.current!}
        style={{ width: "25rem", height: "25rem" }}
      />
    </Backdrop>
  );
};
