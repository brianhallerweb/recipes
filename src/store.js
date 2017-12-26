import { createStore, combineReducers, applyMiddleware } from "redux";
import reducer from "./reducers/reducer";
import { routerReducer, routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";

export const history = createHistory();
const middleware = routerMiddleware(history);

let rootReducer = combineReducers({
  reducer,
  router: routerReducer
});

export const store = createStore(rootReducer, applyMiddleware(middleware));
