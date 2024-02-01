import { defineConfig } from "vite";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import { preact } from "@preact/preset-vite";
import pkg from "./package.json";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    webExtension({
      manifest: generateManifest,
    }),
  ],
  build: {
    outDir: `dist/${pkg.name}`,
  },
});