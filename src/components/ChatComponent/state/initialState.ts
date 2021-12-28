export interface IInitialState {
  searchValue: string;
  isAutocompleteOpen: boolean;
  isSearchLoading: boolean;
  searchUserFound: any;
}

export const initialState: IInitialState = {
  searchValue: "",
  isAutocompleteOpen: false,
  isSearchLoading: false,
  searchUserFound: {},
};
