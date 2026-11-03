import {defineConfig} from "vitest/config";

export default defineConfig({
  resolve: {alias: {"d3-selection": "/src/index.js"}},
  test: {
    environment: "jsdom",
    include: ["test/**/*-test.js"],
    setupFiles: ["test/setup.js"]
  }
});
