import {
    signInWithEmailAndPassword,
    getAuth,
    connectAuthEmulator,
    createUserWithEmailAndPassword,
    UserCredential
} from 'firebase/auth';
import { FirebaseError } from "firebase/app";

import * as uiModule from '../ui';

import {
    loginEmailPassword,
    createAccount,
    monitorAuthState
} from '../index';
jest.mock('firebase/auth');

describe('loginEmailPassword', () => {
    const mockAuth = undefined;
    const mockedSignIn = jest.fn();

    beforeEach(() => {
        document.body.innerHTML = `
    <input id="txtEmail" />
    <input id="txtPassword" />
    <button id="btnLogin" type="button" class="button buttonBlue">
        Log in
    </button>
    <button id="btnSignup" type="button" class="button buttonBlue">
        Sign up
    </button>
        
    `;
        (getAuth as jest.Mock).mockReturnValue(mockAuth);
        (signInWithEmailAndPassword as jest.Mock).mockImplementation(mockedSignIn);
        mockedSignIn.mockResolvedValue({ user: { email: 'test@example.com' } });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call createWithEmailAndPassword with correct credentials', async () => {

        const txtEmail = document.getElementById('txtEmail') as HTMLInputElement;
        const txtPassword = document.getElementById('txtPassword') as HTMLInputElement;

        txtEmail.value = 'test@example.com';
        txtPassword.value = 'password123';

        await loginEmailPassword();

        expect(mockedSignIn).toHaveBeenCalledWith(
            mockAuth,
            'test@example.com',
            'password123'
        );


    });


});

describe('createAccount', () => {
    const mockAuth = undefined;
    const mockedCreateUser = jest.fn();
  
    beforeEach(() => {
      document.body.innerHTML = `
        <input id="txtEmail" />
        <input id="txtPassword" />
      `;
  
      (getAuth as jest.Mock).mockReturnValue(mockAuth);
      (createUserWithEmailAndPassword as jest.Mock).mockImplementation(mockedCreateUser);
      mockedCreateUser.mockResolvedValue({ user: { email: 'test@example.com' } });
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should call createUserWithEmailAndPassword with correct credentials', async () => {
      const txtEmail = document.getElementById('txtEmail') as HTMLInputElement;
      const txtPassword = document.getElementById('txtPassword') as HTMLInputElement;
  
      txtEmail.value = 'test@example.com';
      txtPassword.value = 'password123';
  
      await createAccount();
  
      expect(mockedCreateUser).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password123'
      );
    });
  
  });

  jest.mock('../ui');
  jest.mock('firebase/auth')

  describe('createAccount', () => {
    const mockAuth = undefined;
    const mockedCreateUser = jest.fn();
    const testError = new FirebaseError('auth/error-code', 'Test error message');
  
    beforeEach(() => {
        
      document.body.innerHTML = `
        <input id="txtEmail" />
        <input id="txtPassword" />
      `;
      console.log = jest.fn();
  
      (getAuth as jest.Mock).mockReturnValue(mockAuth);
      (createUserWithEmailAndPassword as jest.Mock).mockImplementation(mockedCreateUser);
      mockedCreateUser.mockRejectedValue(testError);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should handle FirebaseError correctly', async () => {
      const txtEmail = document.getElementById('txtEmail') as HTMLInputElement;
      const txtPassword = document.getElementById('txtPassword') as HTMLInputElement;
  
      txtEmail.value = 'test@example.com';
      txtPassword.value = 'password123';
  
      await createAccount();
  
      expect(mockedCreateUser).toHaveBeenCalledWith(
        mockAuth,
        'test@example.com',
        'password123'
      );
  
      expect(uiModule.showLoginError).toHaveBeenCalledWith(testError);
      expect(console.log).toHaveBeenCalledWith(`There was a Firebase error: ${testError.message}`);
    });
  
  });
