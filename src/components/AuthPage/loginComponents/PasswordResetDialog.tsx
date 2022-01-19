import React, { useCallback, useState, useEffect } from "react";

//Components
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { PasswordResetButton } from "../../../styles/styled-components/PasswordResetButton";

//State and reducer-related
import {
  updateIsDialogOpen,
  updateIsResetEmailValid,
  updateResetEmail,
  resetPasswordResetDialog,
} from "../state/actionCreators";
import { IAction } from "../../../models/IAction";

//helpers
import { checkEmailValid } from "../../../utils/regexHelpers";
import { findUserByEmailOrPhoneNumber, sendPasswordReset } from "../../../utils/firebaseUserHelpers";

interface IPasswordResetDialog {
  isDialogOpen: boolean;
  data: {
    resetEmail: string;
    isResetEmailValid: boolean | null;
  };
  dispatch: React.Dispatch<IAction>;
}

const PasswordResetDialog = (props: IPasswordResetDialog) => {
  const { isDialogOpen, data, dispatch } = props;
  const { resetEmail, isResetEmailValid } = data;
  const [messageToUser, setMessageToUser] = useState("");

  useEffect(() => {
    if (!isDialogOpen) dispatch(resetPasswordResetDialog());
  }, [isDialogOpen]);

  useEffect(() => {
    if (isResetEmailValid) setMessageToUser("");
  }, [isResetEmailValid]);

  const handleEmailValidation = useCallback(async () => {
    const isEmailValid = checkEmailValid(resetEmail);
    dispatch(updateIsResetEmailValid(isEmailValid));
    if (!isEmailValid) return;
  }, [data]);

  const handleSendEmail = useCallback(async () => {
    if (!isResetEmailValid) return;

    const { foundUser, userExists, errorMessage, done } = await findUserByEmailOrPhoneNumber("email", resetEmail);
    if (!userExists) {
      setMessageToUser("No users found with this email adress");
      dispatch(updateIsResetEmailValid(false));
    }
    dispatch(updateIsResetEmailValid(true));
    const error = await sendPasswordReset(resetEmail);
    if (error) return setMessageToUser("Your email could not be found in our database");
    setMessageToUser("A reset link has just been sent to your email adress 🎉");
  }, [data]);

  return (
    <div style={{ position: "absolute" }}>
      <Dialog open={isDialogOpen} onClose={() => dispatch(updateIsDialogOpen(true))}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.3rem", marginBottom: "0.3rem" }}>
          Reset your account
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#fffffe" }}>
          <DialogContentText>
            Please type the email adress associated with your account down below to reset your password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email address"
            type="email"
            name="resetEmail"
            fullWidth
            variant="standard"
            sx={{ marginTop: 3 }}
            value={resetEmail}
            onChange={e => dispatch(updateResetEmail(e.target.value))}
            onBlur={handleEmailValidation}
            helperText={
              messageToUser || (isResetEmailValid === false && "The email adress you provided seems to be incorrect")
            }
            error={isResetEmailValid === false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(updateIsDialogOpen(false))}>Cancel</Button>
          <PasswordResetButton onClick={handleSendEmail} disabled={!isResetEmailValid}>
            Send Reset Email
          </PasswordResetButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PasswordResetDialog;
