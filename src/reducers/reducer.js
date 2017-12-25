const reducer = (state, action) => {
  switch (action.type) {
    case "Category":
      return {
        ...state,
        category: action.setCategory
      };
    case "Search":
      return {
        ...state,
        search: action.setSearch
      };

    case "Searched Recipes":
      return {
        ...state,
        searchedRecipes: action.setSearchedRecipes
      };
    case "Error Message":
      return {
        ...state,
        error: action.message
      };
    case "Success Message":
      return {
        ...state,
        success: action.message
      };

    default:
      return state;
  }
};

export default reducer;
