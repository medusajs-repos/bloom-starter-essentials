import { defineConfig } from "eslint/config"
import medusa from "@medusajs/eslint-plugin"

export default defineConfig([
  {
    // the storefront manages its own ESLint setup
    ignores: ["apps/storefront/**"],
  },
  ...medusa.configs.recommended,
])
