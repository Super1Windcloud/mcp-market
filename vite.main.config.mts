import { defineConfig } from "vite";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: path.resolve(__dirname, "public"),
  plugins: [
    {
      name: "copy-public-folder",
      closeBundle() {
        const src = path.resolve(__dirname, "public");
        const dest = path.resolve(__dirname, ".vite/build");
        if (fs.existsSync(src)) {
          fs.cpSync(src, path.join(dest, "public"), { recursive: true });
          console.log("✅ 已复制 public → .vite/build/public");
        }
      },
    },
  ],

});
