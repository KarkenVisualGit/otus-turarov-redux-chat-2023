module.exports = {
  env: {
    "browser": true,
    "es2021": true,
    "jest/globals": true,
  },
  extends: [
    "airbnb-base",
    "plugin:import/typescript",
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  overrides: [
    {
      files: [".eslintrc.{js,cjs,ts}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
      },
    ],
    "import/prefer-default-export": "warn",
    "jest/valid-title": "warn",
    "no-console": "warn",
    "no-alert": "warn",
    "no-restricted-globals": "warn",
    "no-promise-executor-return": "warn",
    "indent": ["error", "tab"],
    "linebreak-style": [
      "error",
      process.platform === "win32" ? "windows" : "unix",
    ],
    "quotes": ["error", "double"],
    "semi": ["error", "always"],
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "max-len": [
      "error",
      { ignoreTrailingComments: true },
      {
        ignoreComments: true,
      },
      {
        code: 100,
      },
    ],
    "import/no-unresolved": "warn",
  },
};
