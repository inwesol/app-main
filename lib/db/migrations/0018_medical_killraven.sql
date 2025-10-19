ALTER TABLE "career_maturity_assessment" DROP CONSTRAINT "career_maturity_assessment_user_id_session_id_unique";--> statement-breakpoint
ALTER TABLE "career_maturity_assessment" DROP COLUMN IF EXISTS "session_id";--> statement-breakpoint
ALTER TABLE "career_maturity_assessment" ADD CONSTRAINT "career_maturity_assessment_user_id_unique" UNIQUE("user_id");