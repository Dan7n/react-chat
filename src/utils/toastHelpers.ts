/** ////////////////////////////////////////////////
 * Toast notifications helper functions -just call on any of these functions to return a toast notification
 **/ ////////////////////////////////////////////////

import { toast } from "react-hot-toast";

// ------------- Error and Success messages -------------

export const handleLoggedInUserNotification = (emailAdress: string) => toast.success(`Logged in as ${emailAdress}`);

export const handleFalseEmailAdressMsg = () => toast.error("Please provide a valid email adress");

export const handleUserFoundMsg = () =>
  toast.success("Email adress found, you'll now be able to login with your password");

export const handleNewUserMsg = () =>
  toast.success("Let's go ahead and create an account for you! Just enter a secure password and you'll be on your way");

export const handleNoPasswordMsg = () => toast.error("Password field is empty");

export const handleNoUserFoundWithEmail = () => toast.error("We can't find any users matching this email adress.");

export const handleUserFoundWithEmail = () => toast.success("A reset link will shortly be sent to you email adress!");

export const handleEmptyInputFields = () => toast.error("Please make sure both form fields are correctly filled");

export const handleSuccessfulProfileUpdate = () =>
  toast.success("Awesome! Your profile has been created and you'll shortly be redirected to the chat page");

export const handleInvalidConversationErrorMessage = () =>
  toast.error("You cannot create a conversation with yourself!");

export const handleInvalidImgFormat = () => toast.error("File you chose is not a valid image format");

export const handleUserNotLoggedIn = () =>
  toast.error("You do not seem to be logged in, you've been redirected to the login page");
