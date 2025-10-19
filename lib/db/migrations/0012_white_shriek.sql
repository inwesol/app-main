ALTER TABLE "DemographicsDetailsForm" RENAME TO "demographics_details_form";--> statement-breakpoint
ALTER TABLE "demographics_details_form" RENAME COLUMN "form_data" TO "full_name";--> statement-breakpoint
ALTER TABLE "demographics_details_form" DROP CONSTRAINT "DemographicsDetailsForm_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "demographics_details_form" ALTER COLUMN "full_name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "demographics_details_form" ALTER COLUMN "full_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "demographics_details_form" ADD COLUMN "email" varchar(100);--> statement-breakpoint
ALTER TABLE "demographics_details_form" ADD COLUMN "age" integer;--> statement-breakpoint
ALTER TABLE "demographics_details_form" ADD COLUMN "education" varchar(100);--> statement-breakpoint
ALTER TABLE "demographics_details_form" ADD COLUMN "stress_level" integer;--> statement-breakpoint
ALTER TABLE "demographics_details_form" ADD COLUMN "motivation" varchar(500);