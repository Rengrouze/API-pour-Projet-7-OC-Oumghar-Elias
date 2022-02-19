/*
  Warnings:

  - The primary key for the `liked_post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `_id` on the `liked_post` table. All the data in the column will be lost.
  - Made the column `user__id` on table `liked_post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `post__id` on table `liked_post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `liked_post` DROP FOREIGN KEY `fk_liked_post_post1`;

-- DropForeignKey
ALTER TABLE `liked_post` DROP FOREIGN KEY `fk_liked_post_user`;

-- AlterTable
ALTER TABLE `liked_post` DROP PRIMARY KEY,
    DROP COLUMN `_id`,
    MODIFY `user__id` INTEGER NOT NULL,
    MODIFY `post__id` INTEGER UNSIGNED NOT NULL,
    ADD PRIMARY KEY (`user__id`, `post__id`);

-- AddForeignKey
ALTER TABLE `liked_post` ADD CONSTRAINT `fk_liked_post_post1` FOREIGN KEY (`post__id`) REFERENCES `post`(`_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `liked_post` ADD CONSTRAINT `fk_liked_post_user` FOREIGN KEY (`user__id`) REFERENCES `user`(`_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
