// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig(({ command, mode }) => {
//   // Load env file based on `mode` in the current directory.
//   const env = loadEnv(mode, process.cwd(), "");

//   // Use absolute base path by default to avoid routing issues
//   // Only use relative paths (./) if VITE_BASE_PATH is explicitly set to './'
//   // This ensures preview works correctly with SPA routing
//   // Force to '/' for preview/dev, allow env override only for production builds
//   const base =
//     command === "preview" || command === "serve"
//       ? "/"
//       : env.VITE_BASE_PATH || "/";

//   return {
//     appType: "spa",
//     plugins: [react()],
//     base,
//     build: {
//       outDir: "dist",
//       assetsDir: "assets",
//       emptyOutDir: true,
//     },
//     server: {
//       port: 3000,
//       open: true,
//     },
//     preview: {
//       port: 4173,
//       // Ensure SPA routing works in preview
//       strictPort: false,
//     },
//   };
// });
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    appType: "spa",
    plugins: [react()],
    // Force base path to root '/' to avoid unwanted prefixes
    base: "/", 
    build: {
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      open: true,
    },
    preview: {
      port: 4173,
      // Ensure SPA routing works in preview
      strictPort: false,
    },
  };
});