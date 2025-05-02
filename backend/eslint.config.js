import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  // Base configuration for all JavaScript files
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      sourceType: "module",
      globals: {
        // Combine browser and node globals
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      js,
    },
    extends: [js.configs.recommended],
  },
  // React-specific configuration
  {
    files: ["**/*.{jsx}"],
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
  },
];