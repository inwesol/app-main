ALTER TABLE "pre_assessment" ADD COLUMN "score" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "career_maturity_assessment" DROP COLUMN IF EXISTS "score";