import { User } from "@firebase/auth";
import { createContext } from "react";

interface IDispatch {
  action?: string;
  payload?: any;
}

export type IContext = {
  state: {
    user: User | null;
  };
  dispatch: ({ action, payload }: IDispatch) => void;
};

const defaultValue: IContext = {
  state: {
    user: null,
  },
  dispatch: () => {},
};

export const GlobalContext = createContext<IContext>(defaultValue);
