import js from "@eslint/js";
import globals from "globals";
import compat from "eslint-plugin-compat";

export default [
  js.configs.recommended,
  {
    plugins: { compat },
    rules: {
      "no-use-before-define": "error",
      "no-var": "error",
      "prefer-const": "error",
      "compat/compat": "error"
    }
  },
  {
    files: ["src/**/*.js", "test/**/*.js"],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: ["test/**/*.js", "*.js"],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ["test/**/*.js"],
    languageOptions: {
      globals: globals.jest
    }
  }
];
