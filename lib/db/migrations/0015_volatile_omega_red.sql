ALTER TABLE "demographics_details_form" ALTER COLUMN "gender" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "demographics_details_form" ADD COLUMN "profession" varchar(50);--> statement-breakpoint
ALTER TABLE "demographics_details_form" ADD COLUMN "previous_coaching" varchar(20);