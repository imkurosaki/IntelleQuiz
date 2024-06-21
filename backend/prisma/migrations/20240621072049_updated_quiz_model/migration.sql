/*
  Warnings:

  - You are about to drop the column `roomId` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `quizId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_roomId_fkey";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "roomId",
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quizId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_ParticipantToRoom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantToRoom_AB_unique" ON "_ParticipantToRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantToRoom_B_index" ON "_ParticipantToRoom"("B");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantToRoom" ADD CONSTRAINT "_ParticipantToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantToRoom" ADD CONSTRAINT "_ParticipantToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
