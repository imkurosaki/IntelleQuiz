/*
  Warnings:

  - You are about to drop the column `adminId` on the `Points` table. All the data in the column will be lost.
  - Added the required column `participantId` to the `Points` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Points" DROP CONSTRAINT "Points_adminId_fkey";

-- AlterTable
ALTER TABLE "Points" DROP COLUMN "adminId",
ADD COLUMN     "participantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
