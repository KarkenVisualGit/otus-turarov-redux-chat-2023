import chatMiddleware from '../middleware';
import { Store } from '../ChatStore';
import * as chatApi from '../chat';
import { EventDataRec, ServerResponse } from '../chat';
import { jest } from '@jest/globals';
import { ChatActionTypes } from '../ChatReducer';
import { Message } from '../Actions';

jest.mock('../chat');

describe('chatMiddleware', () => {
    let storeMock: Store;
    let nextMock: jest.Mock;
    let actionMock: ChatActionTypes;
    const directMessage: Message = { id: '2', nickname: 'User2', message: 'Hello', date: new Date() };
    const directEventData: EventDataRec = { data: { 'directMessageKey': directMessage } };

    beforeEach(() => {
        storeMock = { dispatch: jest.fn() } as unknown as Store;
        nextMock = jest.fn();
        jest.spyOn(chatApi, 'observeWithEventSource').mockImplementation((callback) => {
            callback(directEventData);
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should handle UPDATE_MESSAGES action', async () => {
        actionMock = { type: 'UPDATE_MESSAGES' };
        const middleware = chatMiddleware(storeMock);

        await middleware(nextMock)(actionMock);

        expect(chatApi.observeWithEventSource).toHaveBeenCalled();

        Object.values(directEventData).forEach((message) => {
            expect(storeMock.dispatch).toHaveBeenCalledWith({
                type: 'RECEIVE_NEW_MESSAGE',
                payload: message
            });
        });

    });
});
