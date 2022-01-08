import React, { useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress, Autocomplete } from "@mui/material";
import { RoundButton } from "./../../../styles/styled-components/RoundButton";
import {
  updateSearchValue,
  updateAutocompleteOpen,
  updateLoadingState,
  updateSearchUser,
  resetSearch,
} from "./../state/actionCreators";
import { useDebounce } from "../../../hooks/useDebounce";
import { checkPhoneNumberValid, checkEmailValid } from "../../../utils/regexHelpers";
import { handleInvalidConversationErrorMessage } from "../../../utils/toastHelpers";
import { createNewConversation, findUserByEmailOrPhoneNumber } from "../../../utils/firebaseUserHelpers";
import { IConversationUser } from "../../../models/IConversationUser";
import { User } from "@firebase/auth";

interface ICreateConversationDialog {
  searchValue: string;
  isAutocompleteOpen: boolean;
  isSearchLoading: boolean;
  searchUserFound: any;
  dispatch: React.Dispatch<any>;
  isDialogOpen: boolean;
  setIsDialogOpen: (newValue: boolean) => void;
  loggedInUser: User;
}

export const CreateConversationDialog = (props: ICreateConversationDialog) => {
  const {
    searchValue,
    isAutocompleteOpen,
    isSearchLoading,
    searchUserFound,
    dispatch,
    isDialogOpen,
    setIsDialogOpen,
    loggedInUser,
  } = props;

  const [autoCompleteOptions, setAutoCompleteOptions] = useState<IConversationUser[] | []>([]);
  const [error, setError] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 800);

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
    //runs with a 0.8s delay as the user types
    if (debouncedSearchValue.length) {
      const isInputValidPhoneNumber = checkPhoneNumberValid(debouncedSearchValue);
      const isInputValidEmail = checkEmailValid(debouncedSearchValue);
      const queryType = isInputValidPhoneNumber ? "phoneNumber" : "email";

      //   if (!isInputValidPhoneNumber && !isInputValidEmail) {
      //     return alert("Please make sure you typed in a correct phone number or email adress");
      //   }

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
            onChange={(e, newVal) => {
              if (newVal) startNewConversation(newVal);
            }}
            onInputChange={(e, newVal) => dispatch(updateSearchValue(newVal))}
            getOptionLabel={(option: any) => option.displayName}
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
