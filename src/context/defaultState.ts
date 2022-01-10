import { User } from "firebase/auth";

export interface IDefaultState {
  user: null | User;
}

export const defaultState: IDefaultState = {
  user: null,
};
