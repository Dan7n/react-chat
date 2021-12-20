export interface ILoginState {
  email: string;
  password: string;
  isEmailValid: boolean | null;
  isPasswordValid: boolean | null;
  isAccountFound: boolean | null;
  isNewUser: boolean | null;
  isLoading: boolean;
  isDialogOpen: boolean;
  message: string;
}

export interface ILoginForm {
  loginPageState: ILoginState;
  dispatch: any;
}
