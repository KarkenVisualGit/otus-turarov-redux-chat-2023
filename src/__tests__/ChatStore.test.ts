import { Store, initialState, rootReducer } from '../ChatStore';

import {
    chatReducer,
    SendMessageAction,
    ReceiveMessagesAction,
    ChatActionTypes
} from '../ChatReducer';

describe('Store', () => {
    it('should return the current state', () => {
        const store = new Store(rootReducer, initialState, (store) => (next) => (action) => next(action));
        expect(store.getState()).toEqual(initialState);
    });

    it('should update the state when an action is dispatched', () => {
        const store = new Store(rootReducer, initialState, (store) => (next) => (action) => next(action));
        const listener = jest.fn();
        store.subscribe(listener);

        const testAction: ReceiveMessagesAction = { type: 'RECEIVE_MESSAGES', payload: [{ id: '1', nickname: 'User', message: 'Test', date: new Date() }] };
        store.dispatch(testAction);

        expect(store.getState().chat.messages).toEqual(testAction.payload);
        expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should apply middleware to dispatched actions', () => {
        const middlewareMock = jest.fn((store) => (next: (action: ChatActionTypes) =>
            void) => (action: ChatActionTypes) => {
                next(action);
            });
        const store = new Store(rootReducer, initialState, middlewareMock);

        const testAction: SendMessageAction = { type: 'SEND_MESSAGE', payload: { id: '2', nickname: 'User2', message: 'Hello', date: new Date() } };
        store.dispatch(testAction);

        expect(middlewareMock).toHaveBeenCalled();
    });

    it('rootReducer should combine state changes', () => {
        const testAction: SendMessageAction = { type: 'SEND_MESSAGE', payload: { id: '2', nickname: 'User2', message: 'Hello', date: new Date() } };
        const newState = rootReducer(initialState, testAction);

        expect(newState.chat).toEqual(chatReducer(initialState.chat, testAction));
    });


});
