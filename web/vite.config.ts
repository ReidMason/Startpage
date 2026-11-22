import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

import { themeCacheKey } from "./src/lib/themeCacheKey";

const themeCacheKeyHtml: Plugin = {
  name: "theme-cache-key-html",
  transformIndexHtml: (html) => html.replaceAll("%THEME_CACHE_KEY%", themeCacheKey),
};

export default defineConfig({
  plugins: [react(), tailwindcss(), themeCacheKeyHtml],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    proxy: {
      "/api": "http://localhost:8080",
      "/auth": "http://localhost:8080",
    },
  },
});
