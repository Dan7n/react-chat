import React from "react";
import { BlurredBlobs } from "../../../styles/styled-components/BlurredBlobs";
import noImgSrc from "./../../../assets/no-messages.png";

const NoMessages = () => {
  return (
    <BlurredBlobs>
      <div className="no-messages">
        <img src={noImgSrc} alt="lady flying on a space rocket" />
        <h1>No messages yet. Start typing and send your first message using the text field down below!</h1>
      </div>
    </BlurredBlobs>
  );
};

export default React.memo(NoMessages);
