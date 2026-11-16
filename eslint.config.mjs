import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import ts from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import refresh from "eslint-plugin-react-refresh";

export default defineConfig([
  globalIgnores([".next/**", "out/**", "build/**", "node_modules/**"]),
  js.configs.recommended,
  ts.configs.recommended,
  { files: ["src/**/*.{ts,tsx}"], plugins: { "react-hooks": hooks, "react-refresh": refresh },
    rules: { ...hooks.configs.recommended.rules, "react-refresh/only-export-components": ["warn", { allowConstantExport: true }] } },
  { files: ["*.mjs", "scripts/*.mjs"], languageOptions: { globals: { console: "readonly", process: "readonly" } } },
]);
