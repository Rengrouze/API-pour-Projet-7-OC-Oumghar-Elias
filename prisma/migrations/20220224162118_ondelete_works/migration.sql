-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `fk_comment_post1`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `fk_comment_user1`;

-- DropForeignKey
ALTER TABLE `liked_post` DROP FOREIGN KEY `fk_liked_post_post1`;

-- DropForeignKey
ALTER TABLE `liked_post` DROP FOREIGN KEY `fk_liked_post_user`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `fk_post_user1`;

-- DropForeignKey
ALTER TABLE `reported_post` DROP FOREIGN KEY `fk_reported_post_post1`;

-- DropForeignKey
ALTER TABLE `reported_post` DROP FOREIGN KEY `fk_reported_post_user`;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `fk_comment_post1` FOREIGN KEY (`post__id`) REFERENCES `post`(`_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `fk_comment_user1` FOREIGN KEY (`user__id`) REFERENCES `user`(`_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `liked_post` ADD CONSTRAINT `fk_liked_post_post1` FOREIGN KEY (`post__id`) REFERENCES `post`(`_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `liked_post` ADD CONSTRAINT `fk_liked_post_user` FOREIGN KEY (`user__id`) REFERENCES `user`(`_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reported_post` ADD CONSTRAINT `fk_reported_post_post1` FOREIGN KEY (`post__id`) REFERENCES `post`(`_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reported_post` ADD CONSTRAINT `fk_reported_post_user` FOREIGN KEY (`user__id`) REFERENCES `user`(`_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `fk_post_user1` FOREIGN KEY (`op`) REFERENCES `user`(`_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
