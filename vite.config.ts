import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
      routes: path.resolve(__dirname, "./src/routes"),
      assets: path.resolve(__dirname, "./src/assets"),
      components: path.resolve(__dirname, "./src/components"),
      views: path.resolve(__dirname, "./src/views"),
      layouts: path.resolve(__dirname, "./src/layouts"),
      variables: path.resolve(__dirname, "./src/variables"),
    },
  },
});
