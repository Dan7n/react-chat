import { toast } from "react-hot-toast";

// ------------- Error and Success messages -------------

export const handleFalseEmailAdressMsg = () => toast.error("Please provide a valid email adress");

export const handleUserFoundMsg = () =>
  toast.success("Email adress found, you'll now be able to login with your password");

export const handleNewUserMsg = () =>
  toast.success("Let's go ahead and create an account for you! Just enter a secure password and you'll be on your way");

export const handleNoPasswordMsg = () => toast.error("Password field is empty");

export const handleNoUserFoundWithEmail = () => toast.error("We can't find any users matching this email adress.");

export const handleUserFoundWithEmail = () => toast.success("A reset link will shortly be sent to you email adress!");
