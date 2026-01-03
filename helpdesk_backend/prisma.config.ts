import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/helpdesk?schema=public'

export default defineConfig({
  schema: 'prisma/schema.prisma',

  datasource: {
    url: connectionString,
  },
})
