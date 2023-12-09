import { AuthErrorCodes, User } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { showLoginError, showLoginState } from '../ui';

type MockUserProps = {
  displayName: string;
  uid: string;
  email: string;
};

const mockFirebaseError = (
  name: string,
  code: string,
  message: string,
): FirebaseError => ({
  name,
  code,
  message,
});

const mockUser = (
  displayName: string,
  uid: string,
  email: string,
): MockUserProps => ({
  displayName,
  uid,
  email,
});

const setupHtmlStructure = () => {
  document.body.innerHTML = `
    <div id="login">
      <div id="divLoginError" class="group" style="display:none">
        <div id="lblLoginErrorMessage" class="errorlabel"></div>
      </div>
    </div>
    <div id="app">
      <div class="header">
        <h1>Welcome to App</h1>
      </div>
      <form>
        <div class="group">
          <div id="lblAuthState" class="authlabel"></div>
        </div>
        <button id="btnLogout" type="button" class="button buttonBlue">
          Log out
        </button>
      </form>
    </div>
    <button id="btnLogout" type="button" class="button buttonBlue">
          Log out
    </button>
    `;
};

describe('Login Error Tests', () => {
  beforeEach(() => {
    setupHtmlStructure();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should display the correct error message for INVALID_PASSWORD', () => {
    const error = mockFirebaseError(
      AuthErrorCodes.INVALID_PASSWORD,
      'some-error-code',
      'Wrong password. Try again.',
    );
    showLoginError(error);
    const errorMessageElement = document.getElementById('lblLoginErrorMessage');

    expect(errorMessageElement).not.toBeNull();
    expect(errorMessageElement?.textContent).toBe(
      'Error: Wrong password. Try again.',
    );
  });

  it('should display the general error message for other errors', () => {
    const error = mockFirebaseError(
      'some-other-error-code',
      'some-error-code',
      'Some error message',
    );
    showLoginError(error);
    const errorMessageElement = document.getElementById('lblLoginErrorMessage');

    expect(errorMessageElement?.textContent).toBe(`Error: ${error.message}`);
  });

  it('should display the correct user information', () => {
    const user = mockUser(
      'John Doe',
      '123456',
      'john@example.com',
    ) as unknown as User;
    showLoginState(user);
    const authStateElement = document.getElementById('lblAuthState');

    expect(authStateElement?.textContent).toContain(
      `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email})`,
    );
  });
});
