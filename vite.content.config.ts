import { defineConfig } from "vite";
import { resolve } from "path";

// content.ts はコンテントスクリプトとして注入されるため、
// import 文を含まない自己完結した IIFE 形式でビルドする
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false, // popup/background のビルド結果を消さない
    lib: {
      entry: resolve(__dirname, "src/content.ts"),
      name: "PiyoMuteContent",
      formats: ["iife"],
      fileName: () => "content.js",
    },
  },
  publicDir: false,
});
