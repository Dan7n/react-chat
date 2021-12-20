interface IReducerAction {
  type: string;
  payload: string | boolean | number;
}

export const reducer = (state: any, action: IReducerAction) => {
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
    case "SET_NEW_USER":
      return { ...state, isNewUser: action.payload };
    case "SET_LOADING_STATE":
      return { ...state, isLoading: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_DIALOG_OPEN":
      return { ...state, isDialogOpen: action.payload };
    default:
      return console.log("Error");
  }
};
