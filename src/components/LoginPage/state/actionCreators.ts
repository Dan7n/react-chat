export const updateEmail = (newEmail: string) => {
  return { type: "UPDATE_EMAIL", payload: newEmail };
};

export const updatePassword = (newPassword: string) => {
  return { type: "UPDATE_PASSWORD", payload: newPassword };
};

export const updateIsEmailValid = (isEmailValid: boolean) => {
  return { type: "SET_EMAIL_VALID", payload: isEmailValid };
};

export const updateIsPasswordValid = (isPasswordValid: boolean) => {
  return { type: "SET_PASSWORD_VALID", payload: isPasswordValid };
};

export const updateIsAccountFound = (isAccountFound: boolean) => {
  return { type: "SET_ACCOUNT_FOUND", payload: isAccountFound };
};
export const updateIsNewUser = (isNewUser: boolean) => {
  return { type: "SET_NEW_USER", payload: isNewUser };
};

export const updateIsLoading = (isLoading: boolean) => {
  return { type: "SET_LOADING_STATE", payload: isLoading };
};

export const updateMessage = (newMessage: string) => {
  return { type: "SET_MESSAGE", payload: newMessage };
};

export const updateIsDialogOpen = (isDialogOpen: boolean) => {
  return { type: "SET_DIALOG_OPEN", payload: isDialogOpen };
};

export const updateResetEmail = (newResetEmail: string) => {
  return { type: "SET_RESET_EMAIL", payload: newResetEmail };
};

export const updateIsResetEmailValid = (isResetEmailValid: boolean) => {
  return { type: "SET_RESET_EMAIL_VALID", payload: isResetEmailValid };
};

export const resetPasswordResetDialog = () => {
  return { type: "RESET_PASSWORD_RESET_DIALOG" };
};

export const toggleShowPassword = (isPasswordShown: boolean) => {
  return { type: "TOGGLE_SHOW_PASSWORD", payload: isPasswordShown };
};
