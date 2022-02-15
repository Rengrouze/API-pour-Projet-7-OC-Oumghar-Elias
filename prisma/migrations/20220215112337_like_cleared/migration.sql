/*
  Warnings:

  - You are about to drop the column `commentsnumber` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `like` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `commentsnumber`,
    DROP COLUMN `like`;
