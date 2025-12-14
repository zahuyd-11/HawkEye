import next from "eslint-plugin-next";
import globals from "globals";

export default [
  {
    ignores: ["**/dist/**", "**/.next/**"],
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      next,
    },
    rules: {
      ...next.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
