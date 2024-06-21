/*
  Warnings:

  - Added the required column `password` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "password" TEXT NOT NULL;
