/* eslint-disable @typescript-eslint/no-unused-vars */
import { useReducer, lazy, Suspense } from "react";
import { reducer } from "./state/reducer";
import { LoginForm } from "./loginComponents/LoginForm";
import { ProfilePage } from "./profileComponents/ProfilePage";
import "./../../styles/components/AuthComponent/styles.scss";
import { ILoginState, initialFormState } from "../../models/IFormValue";
import { Route, Routes, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { RequireAuth } from "../shared/RequireAuth";

import { ThreeScene } from "./3dComponent";

const PasswordResetDialog = lazy(() => import("./loginComponents/PasswordResetDialog"));

export default function AuthPage() {
  const [formState, formDispatch] = useReducer(reducer, initialFormState);

  return (
    <main>
      <section className="three-container">
        {/* Placeholder <Link to={"profile"}>to profile</Link> <Link to={"login"}>to login</Link> */}
        <ThreeScene />
      </section>

      <Suspense fallback={null}>
        <PasswordResetDialog
          isDialogOpen={formState?.isDialogOpen}
          dispatch={formDispatch}
          data={{ resetEmail: formState.resetEmail, isResetEmailValid: formState.isResetEmailValid }}
        />
      </Suspense>

      <section className="loging-container">
        <LoginWave />
        <AnimatePresence exitBeforeEnter>
          <Routes>
            <Route
              path="login"
              element={
                <RequireAuth navigateTo="/chat" shouldUserBeLoggedIn={false}>
                  <LoginForm loginPageState={formState} dispatch={formDispatch} />
                </RequireAuth>
              }
            />
            <Route
              path="profile"
              element={
                <RequireAuth navigateTo="/auth/login">
                  <ProfilePage />
                </RequireAuth>
              }
            />
          </Routes>
        </AnimatePresence>
      </section>
    </main>
  );
}

const LoginWave = () => {
  return (
    <svg id="loginWave" viewBox="0 0 900 300" version="1.1">
      <rect x="0" y="0" width="900" height="300" fill="#f7f8fd"></rect>
      <path
        d="M0 101L129 119L257 100L386 75L514 85L643 108L771 98L900 115L900 0L771 0L643 0L514 0L386 0L257 0L129 0L0 0Z"
        fill="#f8d2ec"></path>
      <path
        d="M0 69L129 79L257 97L386 98L514 67L643 88L771 88L900 68L900 0L771 0L643 0L514 0L386 0L257 0L129 0L0 0Z"
        fill="#e8a9e3"></path>
      <path
        d="M0 60L129 59L257 75L386 67L514 47L643 70L771 61L900 57L900 0L771 0L643 0L514 0L386 0L257 0L129 0L0 0Z"
        fill="#cd82e1"></path>
      <path
        d="M0 29L129 30L257 41L386 42L514 57L643 51L771 39L900 55L900 0L771 0L643 0L514 0L386 0L257 0L129 0L0 0Z"
        fill="#a460e4"></path>
      <path
        d="M0 18L129 28L257 27L386 19L514 34L643 17L771 30L900 34L900 0L771 0L643 0L514 0L386 0L257 0L129 0L0 0Z"
        fill="#6246ea"></path>
    </svg>
  );
};
