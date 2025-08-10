ALTER TABLE "career_story_1" ADD COLUMN "your_current_transition" varchar(4000) NOT NULL;--> statement-breakpoint
ALTER TABLE "career_story_1" ADD COLUMN "career_asp" varchar(4000) NOT NULL;--> statement-breakpoint
ALTER TABLE "career_story_1" ADD COLUMN "hero_1_name" varchar(500);--> statement-breakpoint
ALTER TABLE "career_story_1" ADD COLUMN "hero_1_description" text;--> statement-breakpoint
ALTER TABLE "career_story_1" ADD COLUMN "hero_2_name" varchar(500);--> statement-breakpoint
ALTER TABLE "career_story_1" ADD COLUMN "hero_2_description" text;--> statement-breakpoint
ALTER TABLE "career_story_1" ADD COLUMN "hero_3_name" varchar(500);--> statement-breakpoint
ALTER TABLE "career_story_1" ADD COLUMN "hero_3_description" text;--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "session_number" integer;--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "career_story_1" DROP COLUMN IF EXISTS "answers";