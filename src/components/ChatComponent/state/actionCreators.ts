export const updateSearchValue = (newVal: string) => {
  return { type: "UPDATE_SEARCH_VALUE", payload: newVal };
};

export const updateAutocompleteOpen = (isOpen: boolean) => {
  return { type: "UPDATE_AUTOCOMPLETE_OPEN", payload: isOpen };
};

export const updateLoadingState = (isLoading: boolean) => {
  return { type: "UPDATE_IS_LOADING", payload: isLoading };
};

export const updateSearchUser = (searchUser: any) => {
  return { type: "UPDATE_SEARCH_USER", payload: searchUser };
};

export const resetSearch = () => {
  return { type: "RESET_SEARCH" };
};
