import { createContext } from "react";
import { IDefaultState } from "./defaultState";

interface IDispatch {
  action?: string;
  payload?: any;
}

export interface IContext {
  state: {
    user: IDefaultState | null | unknown;
  };
  dispatch: ({ action, payload }: IDispatch) => void;
}

export const GlobalContext = createContext<IContext | null>(null);
