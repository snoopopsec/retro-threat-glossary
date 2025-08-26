// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// For GitHub Pages project site: https://snoopopsec.github.io/retro-threat-glossary
const repoBase = "/retro-threat-glossary/";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? repoBase : "/", // required for GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
