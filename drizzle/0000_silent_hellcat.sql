CREATE TABLE `team_matchups` (
	`team_id` text NOT NULL,
	`team2_id` text NOT NULL,
	`wins` integer NOT NULL,
	`losses` integer NOT NULL,
	PRIMARY KEY(`team_id`, `team2_id`)
);
