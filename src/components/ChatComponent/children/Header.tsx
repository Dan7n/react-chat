import { useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import "./../styles.scss";

export function Header() {
  return (
    <section className="chat-container__header">
      {/* <Autocomplete
        sx={{ width: 300 }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        filterOptions={x => x}
        // onChange={(e, newVal) => setFoundUser(successfulQueryResult)}
        // onInputChange={(e, newVal) => setSearchQuery(newVal)}
        getOptionLabel={(testOptions):any => testOptions!.displayName}
        options={autoCompleteOptions}
        loading={loading}
        renderInput={params => (
          <TextField
            {...params}
            label="User"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      /> */}
    </section>
  );
}
