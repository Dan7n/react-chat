/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useReducer, lazy, Suspense, useContext } from "react";
import { reducer } from "./state/reducer";
import { LoginForm } from "./LoginForm";
import "./styles.scss";
import { ILoginState } from "../../models/IFormValue";
import { GlobalContext, IContext } from "../../context/GlobalContext";

const PasswordResetDialog = lazy(() => import("./PasswordResetDialog"));
const initialFormState: ILoginState = {
  email: "",
  password: "",
  isEmailValid: null,
  isPasswordValid: null,
  isAccountFound: null,
  isDialogOpen: false,
  isNewUser: null,
  isLoading: false,
  message: "",
  resetEmail: "",
  isResetEmailValid: null,
  isPasswordShown: false,
};

export default function LoginPage() {
  const [formState, formDispatch] = useReducer(reducer, initialFormState);

  return (
    <main>
      <section className="three-container">Placeholder</section>
      <Suspense fallback={null}>
        <PasswordResetDialog
          isDialogOpen={formState?.isDialogOpen}
          dispatch={formDispatch}
          data={{ resetEmail: formState.resetEmail, isResetEmailValid: formState.isResetEmailValid }}
        />
      </Suspense>
      <section className="loging-container">
        <LoginForm loginPageState={formState} dispatch={formDispatch} />
      </section>
    </main>
  );
}
