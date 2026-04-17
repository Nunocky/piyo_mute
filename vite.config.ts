import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync, mkdirSync } from "fs";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup.ts"),
        background: resolve(__dirname, "src/background.ts"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  publicDir: false,
  plugins: [
    {
      name: "copy-icons",
      closeBundle() {
        mkdirSync("dist/icons", { recursive: true });
        for (const size of [16, 48, 128]) {
          copyFileSync(`src/icons/icon${size}.png`, `dist/icons/icon${size}.png`);
        }
      },
    },
  ],
});
