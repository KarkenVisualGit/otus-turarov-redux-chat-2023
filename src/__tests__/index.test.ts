import {
    signInWithEmailAndPassword,
    getAuth,
    connectAuthEmulator,
    createUserWithEmailAndPassword,
    UserCredential
} from 'firebase/auth';

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
