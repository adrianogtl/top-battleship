import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import pluginJest from "eslint-plugin-jest";

export default defineConfig([
  {
    ...js.configs.recommended,

    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module", // Enable ES Modules
      },
    },

    rules: {
      "no-unused-vars": "warn",
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },

  {
    files: ["**/*.js", "**/*.test.js"],
    ...pluginJest.configs["flat/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...pluginJest.configs["flat/recommended"].languageOptions.globals,
      },
    },
  },
  eslintConfigPrettier,
]);
