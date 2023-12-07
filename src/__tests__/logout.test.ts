import { signOut } from 'firebase/auth';
import { logout } from '../index';
jest.mock('firebase/auth');

describe('logout', () => {
  const mockAuth = undefined;
  const mockedSignOut = jest.fn();

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="btnLogout" type="button"></button>
    `;

    (signOut as jest.Mock).mockImplementation(mockedSignOut);
    mockedSignOut.mockResolvedValue(undefined);

    const btnLogout = document.getElementById('btnLogout') as HTMLButtonElement;
    btnLogout.addEventListener("click", logout);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call signOut on logout', async () => {
    const btnLogout = document.getElementById('btnLogout') as HTMLButtonElement;
    btnLogout.click();

    expect(mockedSignOut).toHaveBeenCalledWith(mockAuth);
  });
});
