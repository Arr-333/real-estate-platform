import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.extends("eslint-config-prettier"),
  {
    plugins: {
      prettier,
    },
    rules: {
      // Prettier formatting errors - keep as errors (can be auto-fixed)
      // "prettier/prettier": "error",
      // TypeScript errors -> warnings (don't block commits)
      // These rules will override the default "error" level from Next.js config
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      // General rules as warnings
      "no-unused-vars": "off", // Turn off base rule, use TypeScript version
      "no-console": "warn",
      "no-debugger": "warn",
      // React/Next.js rules as warnings
      "@next/next/no-img-element": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
