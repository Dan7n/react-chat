import React, { useReducer } from "react";
import { reducer } from "./state/reducer";
import { LoginForm } from "./LoginForm";
import "./styles.scss";
import { ILoginState } from "../../models/IFormValue";
import { PasswordResetDialog } from "./PasswordResetDialog";

export const initialFormState: ILoginState = {
  email: "",
  password: "",
  isEmailValid: null,
  isPasswordValid: null,
  isAccountFound: null,
  isDialogOpen: false,
  isNewUser: null,
  isLoading: false,
  message: "",
};

export default function LoginPage() {
  const [formState, formDispatch] = useReducer(reducer, initialFormState);

  return (
    <main>
      <section className="three-container">Placeholder</section>
      <PasswordResetDialog />
      <section className="loging-container">
        <LoginForm loginPageState={formState} dispatch={formDispatch} />
      </section>
    </main>
  );
}
