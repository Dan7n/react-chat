import { useState } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ImageIcon from "@mui/icons-material/Image";

export const AttachmentHandler = ({ handleUpload }) => {
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
      <AttachFileIcon className="icon" onClick={e => handleClick(e)} />
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} className="menu-container">
        <MenuItem>
          <label
            htmlFor="file-uploader"
            style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
            <ImageIcon /> Upload an image
            <input style={{ display: "none" }} type="file" id="file-uploader" onChange={handleUpload} />
          </label>
        </MenuItem>
      </Menu>
    </>
  );
};