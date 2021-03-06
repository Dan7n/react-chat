import { useState } from "react";
import { IAction } from "../../../../models/IAction";

//Components
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ImageIcon from "@mui/icons-material/Image";
import { AudioMessageHandler } from "./AudioMessageHandler";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.5rem",
};

/**
 * @abstract A component that shows a little menu with options to upload a photo or an audio file
 * @param handleUpload: function that runs when the user chooses a photo to upload
 * @param conversationId: document ID in cloud firestore
 * @param uid: the ID to the currently logged in user
 */

interface IAttachementHandler {
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  conversationId: string;
  uid: string;
  dispatch: React.Dispatch<IAction>;
}

export const AttachmentHandler = ({ handleUpload, conversationId, uid, dispatch }: IAttachementHandler) => {
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AttachFileIcon
        className="icon"
        data-cy="attachmentHandler"
        onClick={e => handleClick(e)}
        sx={{ color: "#858585" }}
      />
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} className="menu-container" data-cy="audioMenu">
        <MenuItem>
          <label htmlFor="file-uploader" style={style}>
            <ImageIcon /> Upload an image
            <input style={{ display: "none" }} type="file" id="file-uploader" onChange={handleUpload} />
          </label>
        </MenuItem>
        <MenuItem>
          <AudioMessageHandler conversationId={conversationId} uid={uid} dispatch={dispatch} />
        </MenuItem>
      </Menu>
    </>
  );
};
