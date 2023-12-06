import { signInWithEmailAndPassword } from 'firebase/auth';
import { loginEmailPassword } from '../index';
jest.mock('firebase/auth');

describe('loginEmailPassword', () => {
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
        (signInWithEmailAndPassword as jest.Mock).mockClear();
    });

    it('should call signInWithEmailAndPassword with correct credentials', async () => {

        const txtEmail = document.getElementById('txtEmail') as HTMLInputElement;
        const txtPassword = document.getElementById('txtPassword') as HTMLInputElement;
        expect(txtEmail).not.toBeNull();
        expect(txtPassword).not.toBeNull();
       
        txtEmail.value = 'test@example.com';
        txtPassword.value = 'password123';

        await loginEmailPassword();

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
            expect.anything(),
            'test@example.com',
            'password123'
        );
    });


});
