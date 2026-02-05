import { defineConfig, loadEnv } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  admin: {
    vite: () => {
      let hmrServer;
      if (process.env.HMR_BIND_HOST) {
        const { createServer } = require("http");
        hmrServer = createServer();
        const hmrPort = parseInt(process.env.HMR_PORT || "9001");
        hmrServer.listen(hmrPort, process.env.HMR_BIND_HOST);
      }

      let allowedHosts;
      if (process.env.__MEDUSA_ADDITIONAL_ALLOWED_HOSTS) {
        allowedHosts = [process.env.__MEDUSA_ADDITIONAL_ALLOWED_HOSTS];
      }

      return {
        server: {
          allowedHosts,
          hmr: {
            server: hmrServer,
          },
        },
      };
    },
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,

    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              upload_dir: "/tmp/medusa-uploads",
              backend_url: "https://sb-7z30nygbrw59.ai.staging.medusajs.cloud/uploads",
            },
          },
        ],
      },
    },
  ],
});
