import chatMiddleware from '../middleware';
import { Store } from '../ChatStore';
import { Message } from '../Actions';
import { jest } from '@jest/globals';
import * as chatApi from '../chat';
import {
    ChatActionTypes,
    SendMessageAction,
} from '../ChatReducer';

jest.mock('../chat');

describe('chatMiddleware', () => {
  let storeMock: Store;
  let nextMock: jest.Mock;
  let actionMock: ChatActionTypes;

  beforeEach(() => {
    storeMock = { dispatch: jest.fn() } as unknown as Store;
    nextMock = jest.fn();
    const sendMessageMock = jest.mocked(chatApi.sendMessage);
    sendMessageMock.mockResolvedValue({
        name: 'uniqueMessageId'
      });
  });

  it('should handle SEND_MESSAGE action', async () => {
    const testMessage = { id: '1', nickname: 'User', message: 'Test', date: new Date() };
    actionMock = { type: 'SEND_MESSAGE', payload: testMessage } as SendMessageAction;

    const middleware = chatMiddleware(storeMock);
    await middleware(nextMock)(actionMock);

    expect(chatApi.sendMessage).toHaveBeenCalledWith(testMessage);
    expect(storeMock.dispatch).toHaveBeenCalledWith({ type: 'MESSAGE_SENT', payload: testMessage });
    expect(storeMock.dispatch).toHaveBeenCalledWith({ type: 'GET_MESSAGES' });
  });

  
});
