import React, { useReducer, lazy, Suspense } from "react";
import { reducer } from "./state/reducer";
import { LoginForm } from "./LoginForm";
import "./styles.scss";
import { ILoginState } from "../../models/IFormValue";

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
};

export default function LoginPage() {
  const [formState, formDispatch] = useReducer(reducer, initialFormState);
  console.log(formState.isDialogOpen);

  return (
    <main>
      <section className="three-container">Placeholder</section>
      <Suspense fallback={null}>
        <PasswordResetDialog isDialogOpen={formState?.isDialogOpen} dispatch={formDispatch} />
      </Suspense>
      <section className="loging-container">
        <LoginForm loginPageState={formState} dispatch={formDispatch} />
      </section>
    </main>
  );
}
