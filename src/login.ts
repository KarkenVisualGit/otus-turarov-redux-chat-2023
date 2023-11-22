import './styles.css';
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

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCZsRRy7BwXZOnYz-3BIo-o4WuHl5XKkCE",
    authDomain: "task-calendar-turarov.firebaseapp.com",
    databaseURL:
        "https://task-calendar-turarov-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "task-calendar-turarov",
    storageBucket: "task-calendar-turarov.appspot.com",
    messagingSenderId: "685980356315",
    appId: "1:685980356315:web:b12ef3cf06c0bef5a646fe",
    measurementId: "G-02B3TBFPNX",
});

const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, "http://localhost:9000");

const loginEmailPassword = async (): Promise<void> => {
    const loginEmail = txtEmail.value
    const loginPassword = txtPassword.value

    try {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
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