import { useState, useEffect, useCallback } from "react";
import { IFormValue } from "../../models/IFormValue";
import { SignInWithGoogleBtn } from "./SignInWithGoogleBtn";
import signInImage from "./../../assets/sign-in.png";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { FormHelperText, Input, InputLabel } from "@mui/material";
import { NormalButton } from "../../styles/styled-components/Button";
import { isEmailValid, isPasswordValid } from "../../helpers/regexHelpers";
import { findUserByEmailOrPhoneNumber } from "../../helpers/firebaseUserHelpers";
import { useNavigate } from "react-router-dom";
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import {
  handleFalseEmailAdressMsg,
  handleUserFoundMsg,
  handleNewUserMsg,
  handleNoPasswordMsg,
} from "./../../helpers/toastHelpers";
import { auth } from "./../../firebase-config";
import ScaleLoader from "react-spinners/ClipLoader";

export const defaultFormValue = {
  email: "",
  password: "",
  isEmailValid: null,
  isPasswordValid: null,
};

export const LoginForm = () => {
  const [formInputValue, setFormInputValue] = useState<IFormValue>(defaultFormValue);
  const [accountFound, setAccountFound] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigateTo = useNavigate();

  const [createUserWithEmailAndPassword, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    if (error) console.log(error);
  }, [error]);

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
    if (!formInputValue.email) return handleFalseEmailAdressMsg();
    const emailValid = isEmailValid(formInputValue.email);
    setFormInputValue(currentState => ({ ...currentState, ...{ isEmailValid: emailValid } }));
    if (!emailValid) return handleFalseEmailAdressMsg();
    else {
      console.log("here 60");
      setIsLoading(true);
      checkUserExists();
    }
  }, [formInputValue]);

  const checkUserExists = useCallback(async () => {
    const { foundUser, userExists, done } = await findUserByEmailOrPhoneNumber(formInputValue?.email, "email");
    done === "OK" && setIsLoading(false);

    if (foundUser) {
      handleUserFoundMsg();
      setAccountFound(foundUser);
      handleSignInWithEmailAndPassword();
    } else {
      setIsNewUser(true);
      handleNewUserMsg();
      console.log("not found");
    }
  }, [formInputValue?.isEmailValid, formInputValue?.email]);

  //Sign in methods
  const handleSignInWithEmailAndPassword = useCallback(async () => {
    if (!formInputValue.password) return handleNoPasswordMsg();
    const passwordValid = isPasswordValid(formInputValue.password);
    setFormInputValue(currentState => ({ ...currentState, ...{ isPasswordValid: passwordValid } }));
    if (passwordValid) {
      signInWithEmailAndPassword(formInputValue.email, formInputValue.password);
    }
  }, [formInputValue.email, formInputValue.password, signInWithEmailAndPassword]);

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
            autoComplete="off"
            error={formInputValue.isEmailValid === false || false}
          />

          {(accountFound || isNewUser) && (
            <TextField
              label="Password"
              id="passwordInput"
              size="small"
              className="authForm--input-field"
              name="password"
              value={formInputValue.password}
              onChange={handleChange}
              error={formInputValue.isPasswordValid === false || false}
              helperText={formInputValue.isPasswordValid === false && "Password must contain stuff"}
            />
          )}
        </div>
      </FormControl>
      <div className="buttons-container">
        <NormalButton width="50%" bgColor="#6246ea" hoverShadowColor="251deg 68% 36%" onClick={handleClick}>
          {isLoading ? <ScaleLoader /> : "Continue"}
        </NormalButton>
        <SignInWithGoogleBtn />
      </div>
    </>
  );
};
