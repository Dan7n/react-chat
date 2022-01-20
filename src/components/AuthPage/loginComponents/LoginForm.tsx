import { useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  resetForm,
} from "../state/actionCreators";
import { ILoginForm } from "../../../models/IFormValue";
import { GlobalContext, IContext } from "../../../context/GlobalContext";
import { LoggedInTrue } from "./LoggedInTrue";

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
  const { state } = useContext<IContext>(GlobalContext);
  const navigateTo = useNavigate();

  const isBtnDisabled =
    isPasswordValid === false || ((isAccountFound || isNewUser) && password === "") || !isEmailValid;

  const [createUserWithEmailAndPassword, createUserObject] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword, signinUser, singinLoading, singinError] = useSignInWithEmailAndPassword(auth);

  const handleEmailBlur = useCallback(() => {
    if (email === "") dispatch(updateIsEmailValid(null));
  }, [email]);

  const handlePasswordBlur = useCallback(() => {
    //removes the red warning text if the password box is empty
    if (password === "") dispatch(updateIsPasswordValid(null));
  }, [password]);

  useEffect(() => {
    if (email) {
      const emailValid = checkEmailValid(email!);
      dispatch(updateIsEmailValid(emailValid));
    } else if (email === "") {
      dispatch(resetForm());
    }
  }, [email, isPasswordShown]);

  useEffect(() => {
    if (password) {
      const passwordValid = checkPasswordValid(password);
      dispatch(updateIsPasswordValid(passwordValid));
    }
  }, [password, dispatch]);

  useEffect(() => {
    //Responsible for creating a user in Cloud firestore if the user is signing up, and redirecting to the profile page
    if (createUserObject && loggedInUser) {
      //fires off when a new user gets created
      (async function () {
        await createUserInCloudFirestore(loggedInUser);
        await sendEmailVerification(loggedInUser);
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
  }, [loggedInUser, singinLoading, singinError, createUserObject, dispatch, navigateTo]);

  useEffect(() => {
    if (!signinUser) return;
    const timeout = setTimeout(() => {
      navigateTo("/chat");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [signinUser]);

  // Event handlers ------------------

  const handleSubmit = async () => {
    if (!email) return handleFalseEmailAdressMsg();
    if (!isEmailValid) return handleFalseEmailAdressMsg();
    else {
      dispatch(updateIsLoading(true));
      checkUserExists();
    }
  };

  const checkUserExists = useCallback(async () => {
    if (!isAccountFound) {
      //evaluates true only if the user already has an account in cloud firestore
      const { foundUser, done } = await findUserByEmailOrPhoneNumber("email", email);
      done === "OK" && dispatch(updateIsLoading(false));
      if (foundUser) {
        handleUserFoundMsg();
        dispatch(updateIsAccountFound(Boolean(foundUser)));
      } else {
        dispatch(updateIsNewUser(true));
        !isPasswordValid && handleNewUserMsg();
        handleSignInWithEmailAndPassword("CREATE_ACCOUNT");
      }

      //Else if user is signing in
    } else {
      handleSignInWithEmailAndPassword("SIGN_IN");
    }
  }, [isEmailValid, isPasswordValid, email, password, isAccountFound]);

  //Sign in methods
  const handleSignInWithEmailAndPassword = useCallback(
    async (signInCase: "SIGN_IN" | "CREATE_ACCOUNT") => {
      if (password === "" || !isPasswordValid || !isEmailValid) return;
      if (signInCase === "SIGN_IN") {
        await signInWithEmailAndPassword(email, password);
      } else {
        await createUserWithEmailAndPassword(email, password);
      }
    },
    [email, password, isPasswordValid, isEmailValid]
  );

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{
        type: "spring",
        damping: 10,
        mass: 0.75,
        stiffness: 150,
        duration: 1.3,
      }}>
      {state.user ? (
        <LoggedInTrue />
      ) : (
        <>
          <AnimatePresence>
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
                  onBlur={handleEmailBlur}
                  onKeyUp={e => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  autoComplete="off"
                  error={isEmailValid === false || false}
                />

                {(isAccountFound || isNewUser) && (
                  <motion.div
                    className="input-fields-container__password-container"
                    initial={{ translateY: 30, opacity: 0 }}
                    animate={{ translateY: 0, opacity: 1 }}
                    exit={{ translateY: -30, opacity: 0 }}
                    transition={{ duration: 0.4 }}>
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
                      onBlur={handlePasswordBlur}
                      error={isPasswordValid === false || false}
                      helperText={message || (isPasswordValid === false && "At least 8 chars, including one number")}
                      InputProps={{
                        endAdornment: <PasswordIcon isPasswordShown={isPasswordShown} dispatch={dispatch} />,
                      }}
                    />
                  </motion.div>
                )}
                <button className="authForm__reset-link" onClick={() => dispatch(updateIsDialogOpen(true))}>
                  Forget password?
                </button>
              </div>
            </FormControl>
          </AnimatePresence>

          <div className="buttons-container">
            <NormalButton
              width="55%"
              bgColor={isBtnDisabled ? "gray" : "#6246ea"}
              hoverShadowColor="251deg 68% 36%"
              onClick={handleSubmit}
              disabled={isBtnDisabled}>
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
