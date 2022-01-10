export interface IInitialState {
  searchValue: string;
  isAutocompleteOpen: boolean;
  isSearchLoading: boolean;
}

export const initialState: IInitialState = {
  searchValue: "",
  isAutocompleteOpen: false,
  isSearchLoading: false,
};
