CREATE TABLE IF NOT EXISTS "user_session_form_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" integer NOT NULL,
	"form_id" text NOT NULL,
	"status" varchar(32) NOT NULL,
	"score" integer,
	"completed_at" varchar(32),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
