module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier", "prettier/react"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["react", "prettier"],
  rules: {
    "react/jsx-filename-extension": 0,
    "prettier/prettier": ["error"],
    "react/prop-types": 0,
    "no-param-reassign": 0,
    "react/no-danger": 0,
    "no-nested-ternary": 0,
    "no-bitwise": 0,
    "import/prefer-default-export": 0,
  },
};
