import { onAuthStateChanged } from 'firebase/auth';
import { monitorAuthState } from '../index';
import * as uiModule from '../ui';

jest.mock('firebase/auth');
jest.mock('../ui');

describe('monitorAuthState', () => {
  const mockUser = {
    displayName: 'Test User',
    email: 'test@example.com',
    uid: '12345',
  };

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="lblAuthState"></div>
    `;

    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
    });

    Object.defineProperty(window, 'location', {
      value: {
        href: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call UI functions with logged in user', async () => {
    await monitorAuthState();

    expect(uiModule.showApp).toHaveBeenCalled();
    expect(uiModule.showLoginState).toHaveBeenCalledWith(mockUser);
    expect(uiModule.hideLoginError).toHaveBeenCalled();
    expect(window.location.href).toBe('./app.html');
  });

  it('should show login form when no user', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null);
    });

    await monitorAuthState();

    expect(uiModule.showLoginForm).toHaveBeenCalled();
    const lblAuthState = document.getElementById(
      'lblAuthState',
    ) as HTMLDivElement;
    expect(lblAuthState.innerHTML).toBe("You're not logged in.");
  });
});
