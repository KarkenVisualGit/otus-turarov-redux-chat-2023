import "./style/app.css";
import { initializeApp } from './initializeApp';
import { Store, rootReducer, initialState } from "./ChatStore";
import { chatMiddleware } from "./middleware";

export const store = new Store(rootReducer, initialState, chatMiddleware);
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});
