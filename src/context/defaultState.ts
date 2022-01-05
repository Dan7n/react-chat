import { IUser } from "../models/IUser";

export interface IDefaultState {
  user: null | IUser;
}

export const defaultState = {
  user: null,
};
