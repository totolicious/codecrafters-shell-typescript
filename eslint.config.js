import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["node_modules/", "bun.lock", "eslint.config.js"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
);
