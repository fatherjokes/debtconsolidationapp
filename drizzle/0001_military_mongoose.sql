CREATE TABLE `assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`totalDebt` float NOT NULL,
	`monthlyIncome` float NOT NULL,
	`monthlyExpenses` float NOT NULL,
	`creditScoreRange` enum('excellent','good','fair','poor','bad') NOT NULL,
	`numberOfCreditors` int NOT NULL,
	`homePurchaseTimeline` enum('within_1_year','within_2_years','within_3_years','within_5_years','not_planning') NOT NULL,
	`primaryPriority` enum('speed','credit_preservation','lowest_payment') NOT NULL,
	`riskTolerance` enum('conservative','moderate','aggressive') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessmentId` int NOT NULL,
	`recommendations` json NOT NULL,
	`summary` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shared_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(64) NOT NULL,
	`assessmentId` int NOT NULL,
	`resultId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `shared_links_id` PRIMARY KEY(`id`),
	CONSTRAINT `shared_links_token_unique` UNIQUE(`token`)
);
