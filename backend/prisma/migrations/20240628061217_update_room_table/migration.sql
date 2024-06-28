/*
  Warnings:

  - You are about to drop the column `participantId` on the `Points` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the `Participant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ParticipantToRoom` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `adminId` to the `Points` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Points" DROP CONSTRAINT "Points_participantId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_adminId_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipantToRoom" DROP CONSTRAINT "_ParticipantToRoom_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipantToRoom" DROP CONSTRAINT "_ParticipantToRoom_B_fkey";

-- AlterTable
ALTER TABLE "Points" DROP COLUMN "participantId",
ADD COLUMN     "adminId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "adminId";

-- DropTable
DROP TABLE "Participant";

-- DropTable
DROP TABLE "_ParticipantToRoom";

-- CreateTable
CREATE TABLE "_AdminToRoom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AdminToRoom_AB_unique" ON "_AdminToRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminToRoom_B_index" ON "_AdminToRoom"("B");

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToRoom" ADD CONSTRAINT "_AdminToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToRoom" ADD CONSTRAINT "_AdminToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
