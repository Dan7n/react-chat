import { User } from "firebase/auth";

export const loginUser = (userObject: User) => {
  return { type: "LOGIN_USER", payload: userObject };
};

export const logoutUser = () => {
  return { type: "LOGOUT_USER" };
};
