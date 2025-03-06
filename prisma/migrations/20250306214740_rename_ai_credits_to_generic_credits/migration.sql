/*
  Warnings:

  - You are about to drop the column `aiCredits` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastAICreditReset` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AICreditTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AICreditTransaction" DROP CONSTRAINT "AICreditTransaction_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "aiCredits",
DROP COLUMN "lastAICreditReset",
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "lastCreditReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "AICreditTransaction";

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'ai',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
