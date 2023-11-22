import { AuthErrorCodes, User } from 'firebase/auth';
import { FirebaseError } from "firebase/app";

export const txtEmail = document.querySelector('#txtEmail') as HTMLInputElement;
export const txtPassword = document.querySelector('#txtPassword') as HTMLInputElement;

export const login = document.querySelector('#login') as HTMLDivElement;
export const app = document.querySelector('#app') as HTMLDivElement;

export const btnLogin = document.querySelector('#btnLogin') as HTMLButtonElement;
export const btnSignup = document.querySelector('#btnSignup') as HTMLButtonElement;

export const btnLogout = document.querySelector('#btnLogout') as HTMLButtonElement;

export const divAuthState = document.querySelector('#divAuthState') as HTMLDivElement;
export const lblAuthState = document.querySelector('#lblAuthState') as HTMLDivElement;

export const divLoginError = document.querySelector('#divLoginError') as HTMLDivElement;
export const lblLoginErrorMessage = document.querySelector('#lblLoginErrorMessage') as HTMLDivElement;

export const showLoginForm = (): void => {
  login.style.display = 'block'
  app.style.display = 'none'  
}

export const showApp = (): void => {
  login.style.display = 'none'
  app.style.display = 'block'
}

export const hideLoginError = (): void => {
  divLoginError.style.display = 'none'
  lblLoginErrorMessage.innerHTML = ''
}

export const showLoginError = (error: FirebaseError): void => {
  divLoginError.style.display = 'block'    
  if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
    lblLoginErrorMessage.innerHTML = `Wrong password. Try again.`
  }
  else {
    lblLoginErrorMessage.innerHTML = `Error: ${error.message}`      
  }
}

export const showLoginState = (user: User): void => {
  lblAuthState.innerHTML = `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `
}

hideLoginError()