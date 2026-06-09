import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts", // Prisma 7 define el seed aquí no en package.json
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});