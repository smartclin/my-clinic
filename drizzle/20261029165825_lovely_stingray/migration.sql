CREATE TABLE "drug_formulary" (
	"id" varchar(64) PRIMARY KEY,
	"generic_name" text NOT NULL,
	"pharmacological_category" text NOT NULL,
	"atc_code" varchar(16),
	"aware_classification" varchar(16),
	"data" jsonb NOT NULL,
	"source_edition" varchar(32) DEFAULT 'EDA-2024' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "drug_formulary_generic_idx" ON "drug_formulary" ("generic_name");--> statement-breakpoint
CREATE INDEX "drug_formulary_category_idx" ON "drug_formulary" ("pharmacological_category");