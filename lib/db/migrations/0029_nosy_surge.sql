ALTER TABLE "riasec_test" ADD COLUMN "category_counts" json NOT NULL;--> statement-breakpoint
ALTER TABLE "riasec_test" ADD COLUMN "interest_code" varchar(3) NOT NULL;--> statement-breakpoint
ALTER TABLE "riasec_test" DROP COLUMN IF EXISTS "score";