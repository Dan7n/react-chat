import { IUser } from "./IUser";

export interface IAction {
  type?: string;
  payload?: string | number | boolean | IUser | any;
}
