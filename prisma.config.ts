import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: 'config/prisma/schema.prisma',
  migrations: {
    path: 'config/prisma/migrations',
    seed: 'tsx config/prisma/seed.ts',
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

