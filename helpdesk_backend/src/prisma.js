import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/helpdesk?schema=public'

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: connectionString,
    },
  },
})
