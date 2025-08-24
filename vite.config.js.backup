/* eslint-disable no-undef */
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteSvgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), viteSvgr()],
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components"),
      molecules: path.resolve(__dirname, "src/molecules"),
      atoms: path.resolve(__dirname, "src/atoms"),
      assets: path.resolve(__dirname, "src/assets"),
      configs: path.resolve(__dirname, "src/configs"),
      constants: path.resolve(__dirname, "src/constants"),
      hooks: path.resolve(__dirname, "src/hooks"),
      pages: path.resolve(__dirname, "src/pages"),
      utils: path.resolve(__dirname, "src/utils"),
      lib: path.resolve(__dirname, "src/lib"),
      apis: path.resolve(__dirname, "src/apis"),
      definations: path.resolve(__dirname, "src/definations"),
      services: path.resolve(__dirname, "src/services"),
      store: path.resolve(__dirname, "src/store"),
    },
  },
});
