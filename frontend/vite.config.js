import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({ configFile: "./src/svelte.config.js" })],
  optimizeDeps: { exclude: ["svelte-navigator"] },
});
