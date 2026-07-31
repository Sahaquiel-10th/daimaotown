import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sitesStatic } from "./build/sites-static-plugin.js";

export default defineConfig({
  plugins: [react(), sitesStatic()],
  server: {
    proxy: {
      "/api": {
        target: `http://${process.env.TOWN_WEB_HOST || "127.0.0.1"}:${process.env.TOWN_WEB_PORT || 8091}`,
        changeOrigin: true,
      },
    },
  },
});
