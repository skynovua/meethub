import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      semi: ["error"],
      quotes: ["error", "double"],
      "no-console": ["warn"],
      "no-unused-vars": ["warn"],
      "no-multiple-empty-lines": ["warn", { max: 1 }],
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  }),
];

export default eslintConfig;
