import { createContext } from "react";
import { defaultState } from "./defaultState";

interface IDispatch {
  action?: string;
  payload?: any;
}

export interface IContext {
  state: typeof defaultState | null | unknown;
  dispatch: ({ action, payload }: IDispatch) => void;
}

export const GlobalContext = createContext<IContext | null>(null);
