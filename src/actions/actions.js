export function setCategory(text) {
  return {
    type: "Category",
    setCategory: text
  };
}

export function setSearch(text) {
  return {
    type: "Search",
    setSearch: text
  };
}

export function setSearchedRecipes(array) {
  return {
    type: "Searched Recipes",
    setSearchedRecipes: array
  };
}

export function addErrorMessage(message) {
  return {
    type: "Error Message",
    message
  };
}

export function addSuccessMessage(message) {
  return {
    type: "Success Message",
    message
  };
}
