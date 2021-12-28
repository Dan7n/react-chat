import React, { useState, useEffect, useCallback } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useDebounce } from "./../../../hooks/useDebounce";

import {
  updateSearchValue,
  updateAutocompleteOpen,
  updateLoadingState,
  updateSearchUser,
  resetSearch,
} from "./../state/actionCreators";
import { IInitialState } from "../state/initialState";
import { checkEmailValid, checkPhoneNumberValid } from "./../../../utils/regexHelpers";
import { findUserByEmailOrPhoneNumber, createNewConversation } from "../../../utils/firebaseUserHelpers";

interface ISidePanel extends IInitialState {
  dispatch: React.Dispatch<any>;
  loggedInUser: any;
}

export const SidePanel = React.memo((props: ISidePanel) => {
  const { dispatch, searchValue, isAutocompleteOpen, isSearchLoading, searchUserFound, loggedInUser } = props;
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<[{ displayName: string; id: string }] | []>([]);
  const debouncedSearchValue = useDebounce(searchValue, 800);

  useEffect(() => {
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
          setAutoCompleteOptions([{ displayName: foundUser!.displayName || "Unnamed user", id: foundUser.id }]);
        }
      });
    }
  }, [debouncedSearchValue]);

  const startNewConversation = useCallback(
    async (conversationPartnerId: string) => {
      if (loggedInUser) {
        createNewConversation(loggedInUser.uid, conversationPartnerId);
      }
      //create conversation in cloud firestore

      //add reference of this conversation to both user

      //update UI
    },
    [autoCompleteOptions, setAutoCompleteOptions]
  );

  return (
    <section className="side-panel">
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
          if (newVal) startNewConversation(newVal.id);
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
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </section>
  );
});
