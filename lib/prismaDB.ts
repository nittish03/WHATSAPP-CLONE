import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaDB: PrismaClient }
export const prismaDB = globalForPrisma.prismaDB || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaDB = prismaDB