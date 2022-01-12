export interface IInitialState {
  searchValue: string;
  isAutocompleteOpen: boolean;
  isSearchLoading: boolean;
  isMessagesLoading?: boolean;
}

export const initialState: IInitialState = {
  searchValue: "",
  isAutocompleteOpen: false,
  isSearchLoading: false,
  isMessagesLoading: false,
};
