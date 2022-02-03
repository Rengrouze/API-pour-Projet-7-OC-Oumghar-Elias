/*
  Warnings:

  - Made the column `date` on table `post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `post` MODIFY `date` VARCHAR(45) NOT NULL;
