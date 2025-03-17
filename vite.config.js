import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
        overlay: false,
      },
    port: 5173,
    historyApiFallback: true,
    optimizeDeps: {
      include: ["jwt-decode"]
    }
  },
});


