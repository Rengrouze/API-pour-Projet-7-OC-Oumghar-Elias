-- RenameIndex
ALTER TABLE `comment` RENAME INDEX `fk_comment_post_idx` TO `fk_comment_post1_idx`;

-- RenameIndex
ALTER TABLE `comment` RENAME INDEX `fk_comment_user_idx` TO `fk_comment_user1_idx`;

-- RenameIndex
ALTER TABLE `liked_post` RENAME INDEX `fk_liked_post_post_idx` TO `fk_liked_post_post1_idx`;

-- RenameIndex
ALTER TABLE `reported_post` RENAME INDEX `fk_reported_post_post_idx` TO `fk_reported_post_post1_idx`;
