import { IAction } from "../../../models/IAction";
import { IInitialState } from "./initialState";

export const reducer = (state: IInitialState, action: IAction) => {
  switch (action.type) {
    case "UPDATE_SEARCH_VALUE":
      return { ...state, searchValue: action.payload };
    case "UPDATE_AUTOCOMPLETE_OPEN":
      return { ...state, isAutocompleteOpen: action.payload };
    case "UPDATE_IS_MESSAGES_LOADING":
      return { ...state, isMessagesLoading: action.payload };
    case "UPDATE_SEARCH_USER":
      return { ...state, isSearchLoading: action.payload };
    default:
      throw new Error("Something went wrong, check your action type and payload");
  }
};
