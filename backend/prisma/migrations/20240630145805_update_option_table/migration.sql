/*
  Warnings:

  - Added the required column `index` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Option" ADD COLUMN     "index" INTEGER NOT NULL;
