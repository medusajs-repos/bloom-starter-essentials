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
            id: "s3",
            resolve: "@medusajs/medusa/file-s3",
            is_default: true,
            options: process.env.R2_FILE_URL
              ? {
                  file_url: process.env.R2_FILE_URL,
                  prefix: process.env.R2_PREFIX,
                  bucket: process.env.R2_BUCKET,
                  endpoint: process.env.R2_ENDPOINT,
                  access_key_id: process.env.R2_ACCESS_KEY_ID,
                  secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
                  region: "auto",
                  additional_client_config: {
                    forcePathStyle: false,
                    requestChecksumCalculation: "WHEN_REQUIRED",
                  },
                }
              : {
                  authentication_method: "s3-iam-role",
                  file_url: process.env.S3_FILE_URL,
                  prefix: process.env.S3_PREFIX,
                  bucket: process.env.S3_BUCKET,
                  endpoint: process.env.S3_ENDPOINT,
                  region: process.env.S3_REGION,
                },
          },
        ],
      },
    },
  ],
});
