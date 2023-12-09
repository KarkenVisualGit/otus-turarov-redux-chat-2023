import "./style/app.css";
import { initializeChatApp } from "./initializeChatApp";
import { Store, rootReducer, initialState } from "./ChatStore";
import { chatMiddleware } from "./middleware";

export const store = new Store(rootReducer, initialState, chatMiddleware);
initializeChatApp(store);
// document.addEventListener("DOMContentLoaded", () => {
// 	initializeChatApp(store);
// });

export default store;
