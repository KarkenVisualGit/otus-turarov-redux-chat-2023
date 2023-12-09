import { AuthErrorCodes, User } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export const divAuthState = document.querySelector(
	"#divAuthState"
) as HTMLDivElement;

export const showLoginForm = (): void => {
	const login = document.querySelector("#login") as HTMLDivElement;
	const app = document.querySelector("#app") as HTMLDivElement;
	if (login) {
		login.style.display = "block";
	}
	if (app) {
		app.style.display = "none";
	}
};

export const showApp = (): void => {
	const login = document.querySelector("#login") as HTMLDivElement;
	const app = document.querySelector("#app") as HTMLDivElement;
	if (login) {
		login.style.display = "none";
	}
	if (app) {
		app.style.display = "block";
	}
};

export const hideLoginError = (): void => {
	const divLoginError = document.querySelector(
		"#divLoginError"
	) as HTMLDivElement;
	const lblLoginErrorMessage = document.querySelector(
		"#lblLoginErrorMessage"
	) as HTMLDivElement;
	if (divLoginError) {
		divLoginError.style.display = "none";
	}
	if (lblLoginErrorMessage) {
		lblLoginErrorMessage.innerHTML = "";
	}
};

export const showLoginError = (error: FirebaseError): void => {
	const divLoginError = document.querySelector(
		"#divLoginError"
	) as HTMLDivElement;
	const lblLoginErrorMessage = document.querySelector(
		"#lblLoginErrorMessage"
	) as HTMLDivElement;
	if (divLoginError) {
		divLoginError.style.display = "block";
	}
	if (error.code === AuthErrorCodes.INVALID_PASSWORD && lblLoginErrorMessage) {
		lblLoginErrorMessage.innerHTML = "Wrong password. Try again.";
	} else {
		lblLoginErrorMessage.innerHTML = `Error: ${error.message}`;
	}
};

export const showLoginState = (user: User): void => {
	const lblAuthState = document.querySelector(
		"#lblAuthState"
	) as HTMLDivElement;
	if (lblAuthState) {
		lblAuthState.innerHTML =
      `You're logged in as ${user.displayName} ` +
      `(uid: ${user.uid}, email: ${user.email})`;
	}
};

hideLoginError();
