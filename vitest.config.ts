import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

// Vitest doesn't read tsconfig `paths`, so mirror the "@/*" alias here.
// Default environment is node; component tests can opt into jsdom per-file
// via a `// @vitest-environment jsdom` pragma once they exist.
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
