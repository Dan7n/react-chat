import { useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

//Components
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { FormHelperText } from "@mui/material";
import { NormalButton } from "../../../styles/styled-components/Button";
import ScaleLoader from "react-spinners/ClipLoader";
import { SignInWithGoogleBtn } from "./SignInWithGoogleBtn";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//Utils
import { checkEmailValid, checkPasswordValid } from "../../../utils/regexHelpers";
import { createUserInCloudFirestore, findUserByEmailOrPhoneNumber } from "../../../utils/firebaseUserHelpers";

//Firebase imports
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { handleFalseEmailAdressMsg, handleUserFoundMsg, handleNewUserMsg } from "../../../utils/toastHelpers";
import { auth } from "../../../firebase-config";
import { sendEmailVerification } from "firebase/auth";

//App state
import {
  updateEmail,
  updatePassword,
  updateIsEmailValid,
  updateIsPasswordValid,
  updateIsAccountFound,
  updateIsNewUser,
  updateIsLoading,
  updateMessage,
  updateIsDialogOpen,
  toggleShowPassword,
} from "../state/actionCreators";
import { ILoginForm } from "../../../models/IFormValue";
import { GlobalContext, IContext } from "../../../context/GlobalContext";

import { motion } from "framer-motion";

export const LoginForm = (props: ILoginForm) => {
  const {
    email,
    password,
    isEmailValid,
    isPasswordValid,
    isAccountFound,
    isNewUser,
    isLoading,
    message,
    isPasswordShown,
  } = props.loginPageState;
  const { dispatch } = props;

  const [loggedInUser] = useAuthState(auth);
  const navigateTo = useNavigate();
  const { state } = useContext<IContext>(GlobalContext);

  const [createUserWithEmailAndPassword, createUserObject] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword, signinUser, singinLoading, singinError] = useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    if (createUserObject && loggedInUser) {
      //fires off when a new user gets created
      (async function () {
        await createUserInCloudFirestore(loggedInUser);
        //TODO fix email vertification
        await sendEmailVerification(createUserObject.user);
        navigateTo("/auth/profile");
      })();
    }

    if (!singinError) return;
    const errorMsg = singinError.message;
    errorMsg.includes("wrong-password") &&
      dispatch(updateMessage("Opps, looks like the password you entered was incorrect!"));
    dispatch(updateIsPasswordValid(false));
    const resetPasswordValidTimer = setTimeout(() => updateIsPasswordValid(true), 3000);

    return () => clearTimeout(resetPasswordValidTimer);
  }, [loggedInUser, singinLoading, singinError, createUserObject]);

  // Event handlers ------------------

  const handleSubmit = async () => {
    if (!email) return handleFalseEmailAdressMsg();
    const emailValid = checkEmailValid(email!);
    dispatch(updateIsEmailValid(emailValid));
    if (!emailValid) return handleFalseEmailAdressMsg();
    else {
      dispatch(updateIsLoading(true));
      checkUserExists();
    }
  };

  const checkUserExists = useCallback(async () => {
    const { foundUser, done } = await findUserByEmailOrPhoneNumber("email", email);
    done === "OK" && dispatch(updateIsLoading(false));
    if (foundUser) {
      //fires if the user already has an account in firebase
      handleUserFoundMsg();
      dispatch(updateIsAccountFound(Boolean(foundUser)));
      handleSignInWithEmailAndPassword("SIGN_IN");
    } else {
      dispatch(updateIsNewUser(true));
      handleNewUserMsg();
      handleSignInWithEmailAndPassword("CREATE_ACCOUNT");
    }
  }, [isEmailValid, email, password]);

  //Sign in methods
  const handleSignInWithEmailAndPassword = useCallback(
    async (signInCase: "SIGN_IN" | "CREATE_ACCOUNT") => {
      // if (!password) return handleNoPasswordMsg();
      const passwordValid = checkPasswordValid(password);
      if (password === "") return;
      else dispatch(updateIsPasswordValid(passwordValid));

      if (signInCase === "SIGN_IN") {
        await signInWithEmailAndPassword(email, password);
      } else {
        await createUserWithEmailAndPassword(email, password);
      }
    },
    [createUserWithEmailAndPassword, dispatch, email, password, signInWithEmailAndPassword]
  );

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.4 }}>
      {state.user ? (
        <h1>Logged in</h1>
      ) : (
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
                value={email}
                onChange={e => dispatch(updateEmail(e.target.value))}
                onKeyUp={e => {
                  if (e.key === "Enter") handleSubmit();
                }}
                autoComplete="off"
                error={isEmailValid === false || false}
              />

              {(isAccountFound || isNewUser) && (
                <TextField
                  label="Password"
                  id="passwordInput"
                  size="small"
                  className="authForm--input-field"
                  name="password"
                  type={isPasswordShown ? "text" : "password"}
                  value={password}
                  onChange={e => dispatch(updatePassword(e.target.value))}
                  onKeyUp={e => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  error={isPasswordValid === false || false}
                  helperText={
                    message || (isPasswordValid === false && "Password must be at least 8 chars and contain one number")
                  }
                  InputProps={{
                    endAdornment: <PasswordIcon isPasswordShown={isPasswordShown} dispatch={dispatch} />,
                  }}
                />
              )}
              <button className="authForm__reset-link" onClick={() => dispatch(updateIsDialogOpen(true))}>
                Forget password?
              </button>
            </div>
          </FormControl>
          <div className="buttons-container">
            <NormalButton width="55%" bgColor="#6246ea" hoverShadowColor="251deg 68% 36%" onClick={handleSubmit}>
              {isLoading ? <ScaleLoader color="white" /> : "Continue"}
            </NormalButton>
            <SignInWithGoogleBtn />
          </div>
        </>
      )}
    </motion.div>
  );
};

export const PasswordIcon = ({
  isPasswordShown,
  dispatch,
}: {
  isPasswordShown: boolean;
  dispatch: (action: { type: string; payload: boolean }) => void;
}) => {
  return (
    <InputAdornment
      position="start"
      onClick={() => dispatch(toggleShowPassword(!isPasswordShown))}
      sx={{ cursor: "pointer" }}>
      {!isPasswordShown ? <Visibility /> : <VisibilityOff />}
    </InputAdornment>
  );
};
