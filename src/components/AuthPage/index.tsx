/* eslint-disable @typescript-eslint/no-unused-vars */
import { useReducer, lazy, Suspense, useContext } from "react";
import { reducer } from "./state/reducer";
import { LoginForm } from "./loginComponents/LoginForm";
import { ProfilePage } from "./profileComponents/ProfilePage";
import "./styles.scss";
import { ILoginState, initialFormState } from "../../models/IFormValue";
import { GlobalContext, IContext } from "../../context/GlobalContext";
import { Route, Routes, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { RequireAuth } from "../shared/RequireAuth";

const PasswordResetDialog = lazy(() => import("./loginComponents/PasswordResetDialog"));

export default function AuthPage() {
  const [formState, formDispatch] = useReducer(reducer, initialFormState);

  return (
    <main>
      <section className="three-container">
        Placeholder <Link to={"profile"}>to profile</Link> <Link to={"login"}>to login</Link>
      </section>

      <Suspense fallback={null}>
        <PasswordResetDialog
          isDialogOpen={formState?.isDialogOpen}
          dispatch={formDispatch}
          data={{ resetEmail: formState.resetEmail, isResetEmailValid: formState.isResetEmailValid }}
        />
      </Suspense>

      <section className="loging-container">
        <AnimatePresence exitBeforeEnter>
          <Routes>
            <Route
              path="login"
              element={
                //todo: change shouldUserBeLoggedIn to false
                // <RequireAuth navigateTo="/chat" shouldUserBeLoggedIn={false}>
                <LoginForm loginPageState={formState} dispatch={formDispatch} />
                // </RequireAuth>
              }
            />
            <Route
              path="profile"
              element={
                // <RequireAuth navigateTo="/auth/login">
                <ProfilePage />
                // </RequireAuth>
              }
            />
          </Routes>
        </AnimatePresence>
      </section>
    </main>
  );
}
