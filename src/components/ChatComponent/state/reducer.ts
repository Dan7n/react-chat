import { IAction } from "../../../models/IAction";

export const reducer = (state: any, action: IAction) => {
  switch (action.type) {
    /*
      case "_":
        return { ...state, _: action.payload };
        */

    case "UPDATE_SEARCH_VALUE":
      return { ...state, searchValue: action.payload };
    case "UPDATE_AUTOCOMPLETE_OPEN":
      return { ...state, isAutocompleteOpen: action.payload };
    case "UPDATE_IS_LOADING":
      return { ...state, _: action.payload };
    case "UPDATE_SEARCH_USER":
      return { ...state, isSearchLoading: action.payload };
    case "RESET_SEARCH":
      return { ...state, _: action.payload, searchUserFound: {}, isSearchLoading: false };
    default:
      throw new Error("Something went wrong, check your action type and payload");
  }
};
