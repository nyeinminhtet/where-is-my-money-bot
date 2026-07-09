// lib/prisma.ts
import "dotenv/config"; //
import { PrismaPg } from "@prisma/adapter-pg"; //
import { PrismaClient } from "../generated/prisma/client"; //

const connectionString = `${process.env.DATABASE_URL}`; //
const adapter = new PrismaPg({ connectionString }); //

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter }); //
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
}; //

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton(); //

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; //
