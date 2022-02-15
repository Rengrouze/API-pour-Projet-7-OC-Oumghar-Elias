-- CreateTable
CREATE TABLE `reported_post` (
    `reported` TINYINT NULL DEFAULT 1,
    `user__id` INTEGER NOT NULL,
    `post__id` INTEGER UNSIGNED NOT NULL,

    INDEX `fk_reported_post_post1_idx`(`post__id`),
    INDEX `fk_reported_post_user_idx`(`user__id`),
    PRIMARY KEY (`user__id`, `post__id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reported_post` ADD CONSTRAINT `fk_reported_post_post1` FOREIGN KEY (`post__id`) REFERENCES `post`(`_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reported_post` ADD CONSTRAINT `fk_reported_post_user` FOREIGN KEY (`user__id`) REFERENCES `user`(`_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
