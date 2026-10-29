CREATE TABLE "lms_reference" (
	"id" varchar(96) PRIMARY KEY,
	"gender" "patient_gender" NOT NULL,
	"metric" varchar(16) NOT NULL,
	"x" real NOT NULL,
	"l" real NOT NULL,
	"m" real NOT NULL,
	"s" real NOT NULL,
	"s_unit" varchar(4) DEFAULT 'cv' NOT NULL,
	"sd3neg" real,
	"sd2neg" real,
	"sd1neg" real,
	"sd0" real,
	"sd1pos" real,
	"sd2pos" real,
	"sd3pos" real
);
--> statement-breakpoint
CREATE INDEX "lms_ref_lookup_idx" ON "lms_reference" ("gender","metric","x");