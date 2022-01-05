import { User } from "firebase/auth";
import { IUser } from "../models/IUser";

export const loginUser = (userObject: any) => {
  return { type: "LOGIN_USER", payload: userObject };
};

export const logoutUser = () => {
  return { type: "LOGOUT_USER" };
};
