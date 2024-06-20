/*
  Warnings:

  - The primary key for the `Option` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Option` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Problem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Problem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `problemId` on the `Option` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_problemId_fkey";

-- AlterTable
ALTER TABLE "Option" DROP CONSTRAINT "Option_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "problemId",
ADD COLUMN     "problemId" INTEGER NOT NULL,
ADD CONSTRAINT "Option_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Problem" DROP CONSTRAINT "Problem_pkey",
ADD COLUMN     "startTime" TIMESTAMP(3),
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Problem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "currentProblem" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
