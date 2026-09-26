import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // process.env instead of env(): env() throws when unset, which breaks
    // `prisma generate` (it doesn't need a DB connection) in builds without DATABASE_URL.
    url: process.env.DATABASE_URL ?? '',
  },
})
