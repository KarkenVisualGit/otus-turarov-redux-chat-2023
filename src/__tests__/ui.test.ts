import { showLoginForm, showApp, hideLoginError } from '../ui';

describe('Authentication Tests', () => {
  let loginElement: HTMLDivElement;
  let appElement: HTMLDivElement;
  beforeEach(() => {
    document.body.innerHTML = `
    <div id="login" style="display: none;"></div>
    <div id="app" style="display: block;"></div>
    `;

    loginElement = document.getElementById('login') as HTMLDivElement;
    appElement = document.getElementById('app') as HTMLDivElement;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });
  test('should show login form', () => {
    showLoginForm();
    console.log(loginElement.outerHTML);
    if (loginElement && appElement) {
      expect(loginElement.style.display).toBe("block");
      expect(appElement.style.display).toBe("none");
    } else {
      throw new Error('Elements not found in the document');
    }
  });
});

describe('Auth Module Tests', () => {
  let loginElement: HTMLDivElement;
  let appElement: HTMLDivElement;
  beforeEach(() => {
    document.body.innerHTML = `
    <div id="login" style="display: block;">
      
    </div>
    <div id="app" style="display: none;"> 
      
    </div>
    `;

    loginElement = document.getElementById('login') as HTMLDivElement;
    appElement = document.getElementById('app') as HTMLDivElement;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  test('should show app form', () => {

    showApp();
    
    if (loginElement && appElement) {
      expect(loginElement.style.display).toBe("none");
      expect(appElement.style.display).toBe("block");
    } else {
      throw new Error('Elements not found in the document');
    }

  });

  const setupHtmlStructure = () => {
    document.body.innerHTML = `
    <div id="login">
      <div id="divLoginError" class="group" style="display: block;">
        <div id="lblLoginErrorMessage" class="errorlabel">Error message</div>
      </div>
    </div>
    <div id="app">
      
    </div>
    `;
  };

  describe('Login Error Tests', () => {
    let divLoginError: HTMLDivElement;
    let lblLoginErrorMessage: HTMLDivElement;
    beforeEach(() => {
      setupHtmlStructure();

      divLoginError = document.getElementById('divLoginError') as HTMLDivElement;
      lblLoginErrorMessage = document.getElementById('lblLoginErrorMessage') as HTMLDivElement;
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    test('should hide login form', () => {
      
      hideLoginError();

      expect(divLoginError.style.display).toBe("none");
      expect(lblLoginErrorMessage.textContent).toBe("");

    });
  });
});




