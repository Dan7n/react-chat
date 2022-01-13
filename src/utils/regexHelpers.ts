/* eslint-disable no-useless-escape */

/**
 *
 * @param emailAdress string to test agains email regex
 * @returns true if string is valid email, otherwise false
 */
export const checkEmailValid = (emailAdress: string) => {
  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return emailRegex.test(emailAdress);
};

//--------------------------------------------------------------

/**
 *
 * @param password string to test against
 * @returns true if the password is 8 chars long and must contain at least one letter and one number to pass the validation test, otherwise false
 */
export const checkPasswordValid = (password: string) => {
  //8 chars, one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

//--------------------------------------------------------------

/**
 *
 * @param phoneNumber phone number we want to test
 * @returns true if input is a valid international phone number, otherwise false
 */

export const checkPhoneNumberValid = (phoneNumber: string) => {
  const phoneNumberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return phoneNumberRegex.test(phoneNumber);
};
