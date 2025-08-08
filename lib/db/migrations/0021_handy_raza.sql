CREATE TABLE IF NOT EXISTS "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"feeling" text NOT NULL,
	"takeaway" text,
	"rating" integer NOT NULL,
	"would_recommend" boolean DEFAULT false,
	"suggestions" text,
	"session_id" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
