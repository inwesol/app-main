ALTER TABLE "psychological_wellbeing_test" ALTER COLUMN "score" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "psychological_wellbeing_test" ALTER COLUMN "score" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "psychological_wellbeing_test" ADD COLUMN "subscale_scores" json DEFAULT '{}'::json NOT NULL;