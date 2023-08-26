import { PrismaClient } from '@prisma/client'

interface MyGlobal {
  prisma: PrismaClient | undefined
}

const myGlobal = globalThis as unknown as MyGlobal

export const db = myGlobal.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') myGlobal.prisma = db
