import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite"; // ✅ only if installed

export default defineConfig({
  plugins: [react(), tailwind()],
});
