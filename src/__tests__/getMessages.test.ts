import { getMessagesList, ServerResponse } from '../chat';
global.fetch = jest.fn();

describe('getMessagesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches messages and returns a list of messages', async () => {
    const fakeResponse: ServerResponse = {
      '1': { id: '1', nickname: 'Test User', message: 'Hello', date: new Date() },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(fakeResponse),
    });

    const result = await getMessagesList();

    // Проверяем, что fetch был вызван с правильным URL
    expect(global.fetch).toHaveBeenCalledWith(
      'https://task-calendar-turarov-default-rtdb.asia-southeast1.firebasedatabase.app/messages.json',
      { headers: { "Accept": "application/json", "Content-Type": "application/json" } }
    );

    // Проверяем формат возвращаемых данных
    expect(result).toEqual(
      Object.values(fakeResponse).map((el) => ({
        ...el,
        date: new Date(el.date || Date.now()),
      }))
    );
  });
});
