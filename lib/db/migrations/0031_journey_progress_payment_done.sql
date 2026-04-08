ALTER TABLE "journey_progress" DROP COLUMN IF EXISTS "total_score";
ALTER TABLE "journey_progress" ADD COLUMN IF NOT EXISTS "payment_done" boolean DEFAULT false NOT NULL;
