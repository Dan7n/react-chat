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

type signInCaseType = "SIGN_IN" | "CREATE_ACCOUNT";

export const LoginForm = () => {
  const [formInputValue, setFormInputValue] = useState<IFormValue>(defaultFormValue);
  const [accountFound, setAccountFound] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigateTo = useNavigate();

  const [createUserWithEmailAndPassword, error, user] = useCreateUserWithEmailAndPassword(auth);
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
      handleSignInWithEmailAndPassword("SIGN_IN");
    } else {
      setIsNewUser(true);
      handleNewUserMsg();
      handleSignInWithEmailAndPassword("CREATE_ACCOUNT");
      console.log("not found");
    }
  }, [formInputValue?.isEmailValid, formInputValue?.email, formInputValue?.password]);

  //Sign in methods
  const handleSignInWithEmailAndPassword = useCallback(
    async (signInCase: signInCaseType) => {
      const { email, password } = formInputValue;
      console.log(password);
      // if (!password) return handleNoPasswordMsg();
      const passwordValid = isPasswordValid(password);
      if (password === "") return;
      setFormInputValue(currentState => ({ ...currentState, ...{ isPasswordValid: passwordValid } }));

      if (signInCase === "SIGN_IN") {
        // signInWithEmailAndPassword(email, password);
        console.log("sign in");
      } else {
        console.log("create account");
        createUserWithEmailAndPassword(email, password).then(async () => {
          if (user) {
            console.log(user);
            // const signedInUserId = user.uid;

            // //check if the user is saved in cloud firestore
            // const docRef = doc(db, "users", signedInUserId);
            // const docSnapshot = await getDoc(docRef);
            // const isUserRegistered = docSnapshot.exists();

            // if (!isUserRegistered) {
            //   console.log(docRef, credentials.user);
            //   await createUserInCloudFirestore(docRef, credentials.user);
            // }
          }
        });
      }
    },
    [formInputValue.email, formInputValue.password, signInWithEmailAndPassword]
  );

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
              helperText={
                formInputValue.isPasswordValid === false && "Password must be at least 8 chars and contain one number"
              }
            />
          )}
        </div>
      </FormControl>
      <div className="buttons-container">
        <NormalButton width="50%" bgColor="#6246ea" hoverShadowColor="251deg 68% 36%" onClick={handleClick}>
          {isLoading ? <ScaleLoader color="white" /> : "Continue"}
        </NormalButton>
        <SignInWithGoogleBtn />
      </div>
    </>
  );
};
