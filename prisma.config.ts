import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        // Migratsiyalar o'tishi uchun faqat Direct Connection (5432) kerak
        url: process.env.DIRECT_URL,
    },
});
