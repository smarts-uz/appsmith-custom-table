import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        presets: [
          ["@babel/preset-react", { runtime: "classic" }]
        ]
        // plugins: [["babel-plugin-react-compiler"]], // optional
      },
    }),
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "AppsmithCustomTable",
      fileName: (format) => `app.${format}.js`,
      formats: ["es", "umd"],
    },

    rollupOptions: {
      // 👇 1. Don’t bundle these — they’ll be provided by the consuming app
      external: ["react", "react-dom", "react/jsx-runtime"],

      // 👇 2. Map globals for UMD build (for <script> CDN usage)
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
      },
    },

    // 👇 3. Output cleanup & size optimization
    outDir: "dist",
    sourcemap: true,
    emptyOutDir: false,
    minify: "esbuild",
    cssCodeSplit: true,
  },

  // 👇 4. Dev server for local component testing
  server: {
    cors: true,
    host: true, // makes it reachable via LAN/ngrok
    port: 5173,
  },
});
