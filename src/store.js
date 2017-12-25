import { createStore } from "redux";
import reducer from "./reducers/reducer";

const defaultState = {
  category: "",
  search: "",
  searchedRecipes: [],
  error: "",
  success: ""
};

export default createStore(reducer, defaultState);
