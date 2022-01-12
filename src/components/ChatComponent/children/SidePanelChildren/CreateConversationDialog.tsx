import React, { useState, useEffect, useCallback } from "react";
import { updateAutocompleteOpen, updateSearchValue } from "../../state/actionCreators";
import { IConversationUser } from "../../../../models/IConversationUser";
import { IAction } from "../../../../models/IAction";

//Components
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress, Autocomplete } from "@mui/material";
import { RoundButton } from "../../../../styles/styled-components/RoundButton";

//Custom hooks and helpers
import { useDebounce } from "../../../../hooks/useDebounce";
import { checkPhoneNumberValid, checkEmailValid } from "../../../../utils/regexHelpers";
import { handleInvalidConversationErrorMessage } from "../../../../utils/toastHelpers";
import { createNewConversation, findUserByEmailOrPhoneNumber } from "../../../../utils/firebaseUserHelpers";

//Firebase
import { User } from "@firebase/auth";

interface ICreateConversationDialog {
  searchValue: string;
  isAutocompleteOpen: boolean;
  isSearchLoading: boolean;
  dispatch: React.Dispatch<IAction>;
  isDialogOpen: boolean;
  setIsDialogOpen: (newValue: boolean) => void;
  loggedInUser: User;
}

/**
 * @abstract A popup dialog that enables users to search for other users using an email adress or phone number - upon successful search query a conversation between these two users is created
 */

export const CreateConversationDialog = (props: ICreateConversationDialog) => {
  const { searchValue, isAutocompleteOpen, isSearchLoading, dispatch, isDialogOpen, setIsDialogOpen, loggedInUser } =
    props;
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<IConversationUser[] | []>([]);
  const [error, setError] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 1000);

  const handleClickOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  const handleInvalidConversation = useCallback(() => {
    handleInvalidConversationErrorMessage();
    setError("You cannot start a conversation with yourself");
    setAutoCompleteOptions([]);
  }, []);

  useEffect(() => {
    //Reset search value each time the dialog menu is closed
    if (!isDialogOpen) {
      setAutoCompleteOptions([]);
      setError("");
    }
  }, [isDialogOpen]);

  useEffect(() => {
    //runs with a 1s delay as the user types
    if (debouncedSearchValue.length) {
      const isInputValidPhoneNumber = checkPhoneNumberValid(debouncedSearchValue);
      const isInputValidEmail = checkEmailValid(debouncedSearchValue);
      const queryType = isInputValidPhoneNumber ? "phoneNumber" : "email";

      findUserByEmailOrPhoneNumber(queryType, debouncedSearchValue).then(res => {
        const { foundUser } = res;
        if (foundUser) {
          setAutoCompleteOptions([
            { displayName: foundUser!.displayName || "Unnamed user", id: foundUser.id, photoURL: foundUser.photoURL },
          ]);
        }
      });
    }
  }, [debouncedSearchValue]);

  const startNewConversation = useCallback(
    async (conversationPartnerObj: IConversationUser) => {
      if (loggedInUser) {
        if (loggedInUser.uid === conversationPartnerObj.id) {
          return handleInvalidConversation();
        } else {
          createNewConversation(loggedInUser, conversationPartnerObj);
        }
      }
    },
    [autoCompleteOptions, setAutoCompleteOptions]
  );

  return (
    <div className="dialog-container">
      <RoundButton onClick={handleClickOpen} buttonText="Start conversation" width="100%" padding="1rem" />
      <Dialog open={isDialogOpen} onClose={handleClose}>
        <DialogTitle>Start a conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please type the email adress or telephone number of the user you wish to start a conversation with.
          </DialogContentText>
          <Autocomplete
            open={isAutocompleteOpen}
            onOpen={() => {
              dispatch(updateAutocompleteOpen(true));
            }}
            onClose={() => {
              dispatch(updateAutocompleteOpen(false));
            }}
            filterOptions={option => option}
            onChange={(_, newVal) => {
              if (newVal) startNewConversation(newVal);
            }}
            onInputChange={(_, newVal) => dispatch(updateSearchValue(newVal))}
            getOptionLabel={(option: IConversationUser) => option.displayName}
            options={autoCompleteOptions}
            loading={isSearchLoading}
            renderInput={params => (
              <TextField
                {...params}
                placeholder="Find a user by email or phone number"
                value={searchValue}
                sx={{ padding: "1rem 20px", borderRadius: "10px" }}
                error={Boolean(error.length) && error !== ""}
                helperText={error}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Done</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
