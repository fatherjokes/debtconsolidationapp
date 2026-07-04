CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(512) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`excerpt` text NOT NULL,
	`content` longtext NOT NULL,
	`category` varchar(128) NOT NULL,
	`categoryColor` varchar(64) NOT NULL DEFAULT 'bg-red-600',
	`sourceLabel` varchar(128) NOT NULL DEFAULT 'Editorial',
	`author` varchar(128) NOT NULL DEFAULT 'Adam Tijerina',
	`readingTime` int NOT NULL DEFAULT 5,
	`status` enum('draft','published') NOT NULL DEFAULT 'draft',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
