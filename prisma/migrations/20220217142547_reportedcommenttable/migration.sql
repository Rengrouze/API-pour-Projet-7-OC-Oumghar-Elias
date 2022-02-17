-- CreateTable
CREATE TABLE `reported_comment` (
    `reported` TINYINT NULL DEFAULT 1,
    `user__id` INTEGER NOT NULL,
    `comment__id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`user__id`, `comment__id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reported_comment` ADD CONSTRAINT `fk_reported_comment_comment1` FOREIGN KEY (`comment__id`) REFERENCES `comment`(`_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reported_comment` ADD CONSTRAINT `fk_reported_comment_user` FOREIGN KEY (`user__id`) REFERENCES `user`(`_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
