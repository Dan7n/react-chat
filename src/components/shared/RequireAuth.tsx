import { useLocation, Navigate } from "react-router-dom";
import { ReactChildren, ReactChild, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";

interface IRequireAuth {
  children: ReactChild | ReactChildren;
  navigateTo: string;
  shouldUserBeLoggedIn?: boolean;
}

/**
 * @abstract Simple component that will make sure the user is logged in (or not logged in) before being allowed to access certain routes
 * @returns React child node if the auth state matches "shouldUserBeLoggedIn", otherwise the user will be navigated into another route
 */

export const RequireAuth = ({
  children,
  navigateTo = "auth/login",
  shouldUserBeLoggedIn = true,
}: IRequireAuth): JSX.Element => {
  const { state } = useContext<any>(GlobalContext);
  const { user } = state;

  if (shouldUserBeLoggedIn) {
    return user ? <>{children}</> : <Navigate to={navigateTo} />;
  } else {
    return !user ? <>{children}</> : <Navigate to={navigateTo} />;
  }
};
