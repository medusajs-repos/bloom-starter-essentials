import medusaAiTags from "@medusajs-ai/tags";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Terminal from "vite-plugin-terminal";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [
      Terminal({ console: "terminal", output: ["terminal"] }),
      viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),

      ...(isDev
        ? [
            medusaAiTags({
              enabled: true,
              includeRuntime: true,
            }),
          ]
        : []),

      tanstackStart(),
      viteReact(),
    ],

    ssr: {
      noExternal: ["@medusajs/js-sdk", "@medusajs/types"],
      optimizeDeps: {
        include: ["@medusajs/js-sdk"],
      },
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/react-router",
        "@medusajs/js-sdk",
        "@medusajs/icons",
        "lodash-es",
      ],
      exclude: ["@medusajs-ai/tags"],
    },

    resolve: {
      dedupe: ["react", "react-dom", "@tanstack/react-router"],
    },
  };
});
