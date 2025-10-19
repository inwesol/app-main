ALTER TABLE "personality_test" ALTER COLUMN "score" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "personality_test" ADD COLUMN "subscale_scores" json DEFAULT '{}'::json NOT NULL;