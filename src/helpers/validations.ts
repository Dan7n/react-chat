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
