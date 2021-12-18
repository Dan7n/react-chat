import { useState, useEffect, useCallback } from "react";
import { IFormValue } from "../../models/IFormValue";
import { SignInWithGoogleBtn } from "./SignInWithGoogleBtn";
import signInImage from "./../../assets/sign-in.png";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { FormHelperText, Input, InputLabel } from "@mui/material";
import { NormalButton } from "../../styles/styled-components/Button";
import { isEmailValid } from "./../../helpers/validations";
import { findUserByEmailOrPhoneNumber } from "./../../helpers/firebase-user";
import { useNavigate } from "react-router-dom";

export const defaultFormValue = {
  email: "",
  password: "",
  isEmailValid: null,
};

export const LoginForm = () => {
  const [formInputValue, setFormInputValue] = useState<IFormValue>(defaultFormValue);
  const [accountFound, setAccountFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigateTo = useNavigate();

  // Event handlers ------------------
  const handleChange = useCallback(
    e => {
      const updatedState = { [e.target.name]: e.target.value };
      setFormInputValue(currentState => {
        return { ...currentState, ...updatedState };
      });
    },
    [formInputValue]
  );

  const handleClick = useCallback(async () => {
    setIsLoading(true);
    if (!formInputValue.email) return;
    const emailValid = isEmailValid(formInputValue.email);
    setFormInputValue(currentState => ({ ...currentState, ...{ isEmailValid: emailValid } }));

    if (emailValid) {
      checkUserExists();
    }
  }, [formInputValue]);

  const checkUserExists = useCallback(async () => {
    if (!formInputValue.isEmailValid) return;
    const { foundUser, userExists, done } = await findUserByEmailOrPhoneNumber(formInputValue?.email, "email");
    done === "OK" && setIsLoading(false);

    if (foundUser) {
      setAccountFound(foundUser);
    }
  }, [formInputValue?.isEmailValid, formInputValue?.email]);

  return (
    <>
      <FormControl id="authForm">
        <h1>What is your email adress?</h1>
        <FormHelperText>
          If you have an account you'll be able to sign in with your password, if not we'll create one for you.
        </FormHelperText>
        <div className="input-fields-container">
          <TextField
            label="Email Adress"
            id="emailInput"
            size="small"
            className="authForm--input-field"
            name="email"
            value={formInputValue.email}
            onChange={handleChange}
            error={formInputValue.isEmailValid === false || false}
          />

          {accountFound && (
            <TextField
              label="Password"
              id="passwordInput"
              size="small"
              className="authForm--input-field"
              name="password"
              value={formInputValue.password}
              onChange={handleChange}
            />
          )}
        </div>
      </FormControl>
      <NormalButton width="50%" bgColor="#6246ea" hoverShadowColor="251deg 68% 36%" onClick={handleClick}>
        Continue
      </NormalButton>
      <SignInWithGoogleBtn />
    </>
  );
};
