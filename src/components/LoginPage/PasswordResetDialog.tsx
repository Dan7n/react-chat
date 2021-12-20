import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { updateIsDialogOpen } from "./state/actionCreators";

interface IPasswordResetDialog {
  isDialogOpen: boolean;
  dispatch: React.Dispatch<any>;
}

const PasswordResetDialog = (props: IPasswordResetDialog) => {
  const { isDialogOpen, dispatch } = props;
  console.log(props);

  return (
    <div style={{ position: "absolute" }}>
      <Dialog open={isDialogOpen} onClose={() => dispatch(updateIsDialogOpen(true))}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please type the email adress associated with your account down below to reset your password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            name="resetEmail"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(updateIsDialogOpen(false))}>Cancel</Button>
          <Button onClick={() => dispatch(updateIsDialogOpen(true))}>Send Reset Email</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PasswordResetDialog;
