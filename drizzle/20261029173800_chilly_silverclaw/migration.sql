CREATE TABLE "neonatal_formulary" (
	"id" varchar(64) PRIMARY KEY,
	"name" text NOT NULL,
	"generic_name" text NOT NULL,
	"category" text NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "neonatal_formulary_category_idx" ON "neonatal_formulary" ("category");--> statement-breakpoint
CREATE INDEX "neonatal_formulary_generic_idx" ON "neonatal_formulary" ("generic_name");