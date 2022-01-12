export const updateSearchValue = (newVal: string) => {
  return { type: "UPDATE_SEARCH_VALUE", payload: newVal };
};

export const updateAutocompleteOpen = (isOpen: boolean) => {
  return { type: "UPDATE_AUTOCOMPLETE_OPEN", payload: isOpen };
};

export const updateLoadingState = (isLoading: boolean) => {
  return { type: "UPDATE_IS_MESSAGES_LOADING", payload: isLoading };
};

export const resetSearch = () => {
  return { type: "RESET_SEARCH" };
};
