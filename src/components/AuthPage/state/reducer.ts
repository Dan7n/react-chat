import { IAction } from "../../../models/IAction";
import { ILoginState } from "../../../models/IFormValue";

export const reducer = (state: ILoginState, action: IAction) => {
  switch (action.type) {
    case "UPDATE_EMAIL":
      return { ...state, email: action.payload };
    case "UPDATE_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_EMAIL_VALID":
      return { ...state, isEmailValid: action.payload };
    case "SET_PASSWORD_VALID":
      return { ...state, isPasswordValid: action.payload };
    case "SET_ACCOUNT_FOUND":
      return { ...state, isAccountFound: action.payload };
    case "RESET_FORM":
      return {
        ...state,
        password: "",
        isPasswordValid: null,
        isEmailValid: null,
        isAccountFound: null,
        isNewUser: null,
      };
    case "SET_NEW_USER":
      return { ...state, isNewUser: action.payload };
    case "SET_LOADING_STATE":
      return { ...state, isLoading: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_DIALOG_OPEN":
      return { ...state, isDialogOpen: action.payload };
    case "SET_RESET_EMAIL":
      return { ...state, resetEmail: action.payload };
    case "SET_RESET_EMAIL_VALID":
      return { ...state, isResetEmailValid: action.payload };
    case "RESET_PASSWORD_RESET_DIALOG":
      return { ...state, resetEmail: "", isResetEmailValid: null };
    case "TOGGLE_SHOW_PASSWORD":
      return { ...state, isPasswordShown: action.payload };
    default:
      throw new Error("Something went wrong, check your action type and payload");
  }
};
