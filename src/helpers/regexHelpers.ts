/* eslint-disable no-useless-escape */

/**
 *
 * @param emailAdress string to test agains email regex
 * @returns true if string is valid email, otherwise false
 */
export const isEmailValid = (emailAdress: string) => {
  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return emailRegex.test(emailAdress);
};

/**
 *
 * @param password string to test against
 * @returns true if the password is 8 chars long and must contain at least one letter and one number to pass the validation test, otherwise false
 */
export const isPasswordValid = (password: string) => {
  //8 chars, one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};
