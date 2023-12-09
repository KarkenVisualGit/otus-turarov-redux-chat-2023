import { signOut } from 'firebase/auth';
import {
  handleLogout,
  handleSubmit,
  auth,
  toggleEmojiPicker,
  handleDeleteMessage,
} from '../eventHandlers';
import { Store } from '../ChatStore';
import { sendMessages, deleteMessage } from '../Actions';

jest.mock('firebase/auth');
jest.mock('../application');
const mockStore = {
  dispatch: jest.fn(),
} as unknown as Store;

describe('handleLogout', () => {
  const mockLocation = jest.fn();
  Object.defineProperty(window, 'location', {
    value: { href: mockLocation },
    writable: true,
  });

  it('should call signOut and redirect on successful logout', async () => {
    (signOut as jest.Mock).mockResolvedValueOnce(auth);

    await handleLogout();

    expect(signOut).toHaveBeenCalledWith(auth);
    expect(window.location.href).toBe('index.html');
  });
});

describe('toggleEmojiPicker', () => {
  it('should toggle the display style of emoji picker', () => {
    document.body.innerHTML =
      '<div id="emoji-picker" style="display: none;"></div>';
    const emojiPicker = document.getElementById('emoji-picker') as HTMLElement;

    toggleEmojiPicker(emojiPicker);
    expect(emojiPicker.style.display).toBe('block');

    toggleEmojiPicker(emojiPicker);
    expect(emojiPicker.style.display).toBe('none');
  });
});

describe('handleSubmit', () => {
  it('should dispatch a sendMessages action', () => {
    const preventDefault = jest.fn();
    document.body.innerHTML = `
      <input id="nickname" value="User" />
      <div id="message">Hello World</div>
    `;
    const nicknameInput = document.getElementById(
      'nickname',
    ) as HTMLInputElement;
    const messageInput = document.getElementById('message') as HTMLDivElement;

    handleSubmit(
      { preventDefault } as unknown as Event,
      messageInput,
      nicknameInput,
      mockStore,
    );

    expect(preventDefault).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      sendMessages(expect.anything()),
    );
    expect(messageInput.innerHTML).toBe('');
  });
});

describe('handleDeleteMessage', () => {
  it('should dispatch a deleteMessage action and remove message element', () => {
    document.body.innerHTML = '<div id="messageElement"></div>';
    const messageElement = document.getElementById(
      'messageElement',
    ) as HTMLElement;

    handleDeleteMessage('1', messageElement, mockStore);

    expect(mockStore.dispatch).toHaveBeenCalledWith(deleteMessage('1'));
    expect(messageElement.parentNode).toBeNull();
  });
});
