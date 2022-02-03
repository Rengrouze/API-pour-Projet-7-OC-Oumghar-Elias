/*
  Warnings:

  - You are about to drop the column `content` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `birthday` on the `user` table. All the data in the column will be lost.
  - Added the required column `mediaurl` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaurl` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` DROP COLUMN `content`,
    ADD COLUMN `mediaurl` LONGTEXT NOT NULL,
    ADD COLUMN `text` LONGTEXT NOT NULL,
    ADD COLUMN `time` VARCHAR(45) NOT NULL;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `content`,
    DROP COLUMN `title`,
    ADD COLUMN `mediaurl` LONGTEXT NOT NULL,
    ADD COLUMN `text` LONGTEXT NOT NULL,
    ADD COLUMN `time` VARCHAR(45) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `birthday`,
    ADD COLUMN `isamod` TINYINT NULL;
