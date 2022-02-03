-- CreateTable
CREATE TABLE `comment` (
    `_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(280) NULL,
    `enable` TINYINT NULL DEFAULT 1,
    `date` VARCHAR(45) NOT NULL,
    `user__id` INTEGER NOT NULL,
    `post__id` INTEGER UNSIGNED NOT NULL,

    INDEX `fk_comment_post1_idx`(`post__id`),
    INDEX `fk_comment_user1_idx`(`user__id`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `liked_post` (
    `liked` TINYINT NULL DEFAULT 1,
    `user__id` INTEGER NOT NULL,
    `post__id` INTEGER UNSIGNED NOT NULL,

    INDEX `fk_liked_post_post1_idx`(`post__id`),
    INDEX `fk_liked_post_user_idx`(`user__id`),
    PRIMARY KEY (`user__id`, `post__id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(45) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `like` INTEGER NULL DEFAULT 0,
    `enable` TINYINT NULL DEFAULT 1,
    `date` DATETIME(0) NULL,
    `commentsnumber` INTEGER NULL,
    `op` INTEGER NOT NULL,
    `reports` INTEGER NULL DEFAULT 0,

    INDEX `fk_post_user1_idx`(`op`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `surname` VARCHAR(45) NOT NULL,
    `birthday` DATE NULL,
    `workplace` VARCHAR(255) NULL DEFAULT 'Groupomania',
    `password` VARCHAR(45) NOT NULL,
    `email` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `_id_UNIQUE`(`_id`),
    UNIQUE INDEX `email_UNIQUE`(`email`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `fk_comment_post1` FOREIGN KEY (`post__id`) REFERENCES `post`(`_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `fk_comment_user1` FOREIGN KEY (`user__id`) REFERENCES `user`(`_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `liked_post` ADD CONSTRAINT `fk_liked_post_post1` FOREIGN KEY (`post__id`) REFERENCES `post`(`_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `liked_post` ADD CONSTRAINT `fk_liked_post_user` FOREIGN KEY (`user__id`) REFERENCES `user`(`_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `fk_post_user1` FOREIGN KEY (`op`) REFERENCES `user`(`_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
