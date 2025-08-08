ALTER TABLE "feedback" ALTER COLUMN "session_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "feedback" DROP COLUMN IF EXISTS "session_number";