import { useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

//Components
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { FormHelperText } from "@mui/material";
import { NormalButton } from "../../styles/styled-components/Button";
import ScaleLoader from "react-spinners/ClipLoader";
import { SignInWithGoogleBtn } from "./SignInWithGoogleBtn";
import signInImage from "./../../assets/sign-in.png";

//Utils
import { checkEmailValid, checkPasswordValid } from "../../utils/regexHelpers";
import { createUserInCloudFirestore, findUserByEmailOrPhoneNumber } from "../../utils/firebaseUserHelpers";

//Firebase imports
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import {
  handleFalseEmailAdressMsg,
  handleUserFoundMsg,
  handleNewUserMsg,
  handleNoPasswordMsg,
} from "../../utils/toastHelpers";
import { auth } from "./../../firebase-config";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

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
} from "./state/actionCreators";
import { ILoginState, ILoginForm } from "../../models/IFormValue";

type signInCaseType = "SIGN_IN" | "CREATE_ACCOUNT";

export const LoginForm = (props: ILoginForm) => {
  const { email, password, isEmailValid, isPasswordValid, isAccountFound, isNewUser, isLoading, message } =
    props.loginPageState;
  const { dispatch } = props;

  const [loggedInUser] = useAuthState(auth);
  const navigateTo = useNavigate();

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    //fires off when user creates
    if (error) {
      const errorMsg = error.message;
      errorMsg.includes("wrong-password") &&
        dispatch(updateMessage("Opps, looks like the password you entered was incorrect!"));
    }
    if (loggedInUser) {
      console.log({ loggedInUser });
      (async function () {
        await createUserInCloudFirestore(loggedInUser);
      })();
    }
  }, [loggedInUser, loading, error]);

  // Event handlers ------------------

  const handleClick = async () => {
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
    const { foundUser, userExists, done } = await findUserByEmailOrPhoneNumber(email, "email");
    done === "OK" && dispatch(updateIsLoading(false));

    if (foundUser) {
      handleUserFoundMsg();
      dispatch(updateIsAccountFound(foundUser));
      handleSignInWithEmailAndPassword("SIGN_IN");
    } else {
      dispatch(updateIsNewUser(true));
      handleNewUserMsg();
      handleSignInWithEmailAndPassword("CREATE_ACCOUNT");
    }
  }, [isEmailValid, email, password]);

  //Sign in methods
  const handleSignInWithEmailAndPassword = useCallback(
    async (signInCase: signInCaseType) => {
      // if (!password) return handleNoPasswordMsg();
      const passwordValid = checkPasswordValid(password);
      if (password === "") return;
      else dispatch(updateIsPasswordValid(passwordValid));

      if (signInCase === "SIGN_IN") {
        await signInWithEmailAndPassword(email, password);
        console.log("sign in");
      } else {
        console.log("create account");
        await createUserWithEmailAndPassword(email, password);
      }
    },
    [createUserWithEmailAndPassword, dispatch, email, password, signInWithEmailAndPassword]
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
            value={email}
            onChange={e => dispatch(updateEmail(e.target.value))}
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
              value={password}
              onChange={e => dispatch(updatePassword(e.target.value))}
              error={isPasswordValid === false || false}
              helperText={isPasswordValid === false && "Password must be at least 8 chars and contain one number"}
            />
          )}
          <button className="authForm__reset-link" onClick={() => dispatch(updateIsDialogOpen(true))}>
            Forget password?
          </button>
          <p className="authForm__error">{message}</p>
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
