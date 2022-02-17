/*
  Warnings:

  - You are about to drop the `reported_comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `reported_comment` DROP FOREIGN KEY `fk_reported_comment_comment1`;

-- DropForeignKey
ALTER TABLE `reported_comment` DROP FOREIGN KEY `fk_reported_comment_user`;

-- DropTable
DROP TABLE `reported_comment`;
