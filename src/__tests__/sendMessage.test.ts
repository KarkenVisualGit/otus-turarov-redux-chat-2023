import {
  sendMessage,
  SendMessageResponse,
  getMessagesWithIds,
  config,
} from '../chat';

global.fetch = jest.fn();

describe('sendMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-12-07T06:15:44.308Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('sends a message and returns a response', async () => {
    const fakeData = {
      nickname: 'Test User',
      message: 'Hello World',
      id: '123',
      date: new Date(),
    };

    const fakeResponse: SendMessageResponse = { name: 'message-id' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(fakeResponse),
    });

    const result = await sendMessage(fakeData);

    expect(global.fetch).toHaveBeenCalledWith(
      `${config.firebaseBaseUrl}/${config.firebaseCollection}`,
      {
        method: 'POST',
        body: JSON.stringify(fakeData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    expect(result).toEqual(fakeResponse);
  });
});

describe('getMessagesWithIds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches messages with ids and returns a response', async () => {
    const fakeResponse = {
      id1: {
        nickname: 'User1',
        message: 'Hello',
        date: '2023-12-07T06:15:44.308Z',
      },
      id2: {
        nickname: 'User2',
        message: 'Hi',
        date: '2023-12-07T06:20:44.308Z',
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(fakeResponse),
    });

    const result = await getMessagesWithIds();

    expect(global.fetch).toHaveBeenCalledWith(
      `${config.firebaseBaseUrl}/${config.firebaseCollection}`,
    );

    expect(result).toEqual(fakeResponse);
  });
});
