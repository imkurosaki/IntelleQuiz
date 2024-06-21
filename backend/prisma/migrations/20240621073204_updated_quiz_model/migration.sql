/*
  Warnings:

  - You are about to drop the column `points` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `quizId` on the `Participant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_quizId_fkey";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "points",
DROP COLUMN "quizId";

-- CreateTable
CREATE TABLE "Points" (
    "id" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "participantId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "Points_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
