import { IAction } from "./../models/IAction";
import { IDefaultState } from "./defaultState";

export const reducer = (state: IDefaultState, action: IAction) => {
  switch (action.type) {
    case "LOGIN_USER":
      return { ...state, user: action.payload };
    case "LOGOUT_USER":
      return { ...state, user: null };
    default:
      throw new Error("Something went wrong, check your action type and payload");
  }
};
