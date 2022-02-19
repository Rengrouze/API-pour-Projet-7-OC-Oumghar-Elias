/*
  Warnings:

  - The primary key for the `liked_post` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `liked_post` DROP PRIMARY KEY,
    ADD COLUMN `_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    MODIFY `user__id` INTEGER NULL,
    MODIFY `post__id` INTEGER UNSIGNED NULL,
    ADD PRIMARY KEY (`_id`);
