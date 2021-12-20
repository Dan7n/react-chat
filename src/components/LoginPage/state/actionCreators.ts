export const updateEmail = (newEmail: string) => {
  return { type: "UPDATE_EMAIL", payload: newEmail };
};

export const updatePassword = (newPassword: string) => {
  return { type: "UPDATE_EMAIL", payload: newPassword };
};

export const updateIsEmailValid = (isEmailValid: boolean) => {
  return { type: "UPDATE_EMAIL", payload: isEmailValid };
};

export const updateIsPasswordValid = (isPasswordValid: boolean) => {
  return { type: "UPDATE_EMAIL", payload: isPasswordValid };
};

export const updateIsAccountFound = (isAccountFound: boolean) => {
  return { type: "UPDATE_EMAIL", payload: isAccountFound };
};
export const updateIsNewUser = (isNewUser: boolean) => {
  return { type: "UPDATE_EMAIL", payload: isNewUser };
};

export const updateIsLoading = (isLoading: boolean) => {
  return { type: "UPDATE_EMAIL", payload: isLoading };
};

export const updateMessage = (newMessage: string) => {
  return { type: "UPDATE_EMAIL", payload: newMessage };
};

export const updateIsDialogOpen = (isDialogOpen: boolean) => {
  return { type: "SET_DIALOG_OPEN", payload: isDialogOpen };
};
