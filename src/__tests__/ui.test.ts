import * as authModule from '../ui';
import '@testing-library/jest-dom';
import { AuthErrorCodes, User } from "firebase/auth";
import { FirebaseError } from "firebase/app";


type MockUserProps = {
  displayName: string,
  uid: string,
  email: string,
};

const mockFirebaseError = (name: string, code: string,
  message: string)
  : FirebaseError => ({
    name,
    code,
    message
  });

const mockUser = (displayName: string, uid: string, email: string): MockUserProps => ({
  displayName,
  uid,
  email
});

describe('Authentication Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <div id="login">
     
    </div>
    <div id="app" style="display: none;">
    </div>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });
  test.only('should show login form', () => {
    authModule.showLoginForm();
    const loginElement = document.getElementById('login');
    const appElement = document.getElementById('app');

    if (loginElement && appElement) {
      expect(loginElement).toBeVisible();
      expect(appElement).not.toBeVisible();
    } else {
      throw new Error('Elements not found in the document');
    }
  });
});

describe('Auth Module Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <div id="login" style="display: none;">
      
    </div>
    <div id="app">
      
    </div>
    `;
  });
 
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test.only('should show app form', () => {

    authModule.showApp();
    const loginElement = document.getElementById('login');
    const appElement = document.getElementById('app');

    if (loginElement && appElement) {
      expect(loginElement).not.toBeVisible();
      expect(appElement).toBeVisible();
    } else {
      throw new Error('Elements not found in the document');
    }

  });

  test('should hide login form', () => {

    authModule.hideLoginError();
    expect(authModule.divLoginError).not.toBeVisible();
    expect(authModule.lblLoginErrorMessage.innerHTML).toBe("");

  });

  it('should display the correct error message for INVALID_PASSWORD', () => {
    const error = mockFirebaseError(AuthErrorCodes.INVALID_PASSWORD, 'some-error-code', 'Some error message');
    authModule.showLoginError(error);
    const errorMessageElement = document.getElementById('lblLoginErrorMessage');
    if (errorMessageElement) {
      expect(errorMessageElement.textContent).toBe("Wrong password. Try again.");
    } else {
      throw new Error('Element not found');
    }
  });

  it('should display the general error message for other errors', () => {
    const error = mockFirebaseError('some-other-error-code', 'some-error-code', 'Some error message');
    authModule.showLoginError(error);
    const errorMessageElement = document.getElementById('lblLoginErrorMessage');
    if (errorMessageElement) {
      expect(errorMessageElement.textContent).toBe(`Error: ${error.message}`);
    } else {
      throw new Error('Element not found');
    }
  });

  it('should display the correct user information', () => {
    const user = mockUser('John Doe', '123456', 'john@example.com') as unknown as User;
    authModule.showLoginState(user);
    const authStateElement = document.getElementById('lblAuthState');
    if (authStateElement) {
      expect(authStateElement.textContent)
        .toContain(`You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email})`);
    } else {
      throw new Error('Element not found');
    }

  });


});
