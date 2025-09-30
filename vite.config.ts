import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: "VITE_",

  server: {
    proxy: {
      "/api": {
        target: "https://codeplay-backend-o9ve.onrender.com",
        changeOrigin: true, // Needed for successful proxying
        secure: false, // Use true if target is HTTPS, false if HTTP
      },
    },
  },
});
