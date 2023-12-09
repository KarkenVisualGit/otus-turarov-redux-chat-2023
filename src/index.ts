import "./style/style.css";

import { initializeApp, FirebaseError } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // connectAuthEmulator,
  User,
} from "firebase/auth";
import {
  hideLoginError,
  showLoginState,
  showLoginForm,
  showApp,
  showLoginError,
} from "./ui";
import { firebaseConfig } from "./chat";

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
// connectAuthEmulator(auth, "http://localhost:9099");

export const loginEmailPassword = async (): Promise<void> => {
  const txtEmail = document.querySelector("#txtEmail") as HTMLInputElement;
  const txtPassword = document.querySelector(
    "#txtPassword"
  ) as HTMLInputElement;
  // const loginEmail = txtEmail ? txtEmail.value : '';
  // const loginPassword = txtPassword ? txtPassword.value : '';

  const loginEmail = txtEmail.value;
  const loginPassword = txtPassword.value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );
    if (userCredential && userCredential.user && userCredential.user.email) {
      localStorage.setItem("userEmail", userCredential.user.email);
    }
  } catch (error) {
    if (error instanceof FirebaseError) {
      // eslint-disable-next-line no-console
      console.log(`There was a Firebase error: ${error.message}`);
      showLoginError(error);
    }
  }
};

export const createAccount = async (): Promise<void> => {
  const txtEmail = document.querySelector("#txtEmail") as HTMLInputElement;
  const txtPassword = document.querySelector(
    "#txtPassword"
  ) as HTMLInputElement;
  const email = txtEmail.value;
  const password = txtPassword.value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      // eslint-disable-next-line no-console
      console.log(`There was a Firebase error: ${error.message}`);
      showLoginError(error);
    }
  }
};

export const monitorAuthState = async (): Promise<void> => {
  const lblAuthState = document.querySelector(
    "#lblAuthState"
  ) as HTMLDivElement;
  onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      showApp();
      showLoginState(user);

      hideLoginError();
      window.location.href = "./app.html";
    } else {
      showLoginForm();
      lblAuthState.innerHTML = "You're not logged in.";
    }
  });
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};
const btnLogin = document.querySelector("#btnLogin") as HTMLButtonElement;
const btnSignup = document.querySelector("#btnSignup") as HTMLButtonElement;

const btnLogout = document.querySelector("#btnLogout") as HTMLButtonElement;
if (btnLogin && btnSignup && btnLogout) {
  btnLogin.addEventListener("click", loginEmailPassword);
  btnSignup.addEventListener("click", createAccount);
  btnLogout.addEventListener("click", logout);
}

monitorAuthState();
