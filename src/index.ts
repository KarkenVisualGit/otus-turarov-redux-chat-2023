import "./style/style.css";
import {
    hideLoginError,
    showLoginState,
    showLoginForm,
    showApp,
    showLoginError,
    btnLogin,
    btnSignup,
    btnLogout,
    txtEmail,
    txtPassword,
    lblAuthState
} from './ui'

import { initializeApp, FirebaseError } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    connectAuthEmulator,
    User
} from 'firebase/auth';
import { firebaseConfig } from './chat';

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, "http://localhost:9099");

const loginEmailPassword = async (): Promise<void> => {
    const loginEmail = txtEmail.value
    const loginPassword = txtPassword.value

    try {
        const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        if (userCredential && userCredential.user && userCredential.user.email) {
            localStorage.setItem('userEmail', userCredential.user.email);
        }
        
    }
    catch (error) {
        if (error instanceof FirebaseError) {
            console.log(`There was a Firebase error: ${error.message}`);
            showLoginError(error);
        }
    }
}

const createAccount = async (): Promise<void> => {
    const email = txtEmail.value
    const password = txtPassword.value

    try {
        await createUserWithEmailAndPassword(auth, email, password)
    }
    catch (error) {
        if (error instanceof FirebaseError) {
            console.log(`There was a Firebase error: ${error.message}`);
            showLoginError(error);
        }
    }
}

const monitorAuthState = async (): Promise<void> => {
    onAuthStateChanged(auth, (user: User | null) => {
        if (user) {
            console.log(user);
            showApp();
            showLoginState(user);

            hideLoginError();
            window.location.href = './app.html';
        }
        else {
            showLoginForm();
            lblAuthState.innerHTML = `You're not logged in.`;
        }
    })
}

const logout = async (): Promise<void> => {
    await signOut(auth);
}

btnLogin.addEventListener("click", loginEmailPassword)
btnSignup.addEventListener("click", createAccount)
btnLogout.addEventListener("click", logout)

monitorAuthState();