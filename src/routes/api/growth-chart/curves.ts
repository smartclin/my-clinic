// src/routes/api/growth-chart/curves.ts
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { EGYPTIAN_LMS_DATA } from "#/data/egyptianLmsData";

const schema = z.object({
	indicator: z.enum([
		"weight-for-age",
		"length-for-age",
		"weight-for-length",
		"bmi-for-age"
	]),
	sex: z.enum(["male", "female"]),
	range: z.string() // JSON string: { min: number, max: number }
});

const rangeSchema = z.object({ min: z.number(), max: z.number() });

const METRIC_MAP = {
	"weight-for-age": "wfa",
	"length-for-age": "lhfa",
	"weight-for-length": "wfl",
	"bmi-for-age": "bmifa"
} as const;

// Cache-Control: 1 day, immutable — growth data doesn't change per request.
const CACHE_HEADERS = {
	"Cache-Control": "public, max-age=86400, immutable"
} as const;

export const Route = createFileRoute("/api/growth-chart/curves")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);

				const parsed = schema.safeParse(Object.fromEntries(url.searchParams));
				if (!parsed.success) {
					return Response.json(
						{ error: "Invalid query parameters", issues: parsed.error.issues },
						{ status: 400 }
					);
				}

				let range: { min: number; max: number };
				try {
					range = rangeSchema.parse(JSON.parse(parsed.data.range));
				} catch {
					return Response.json(
						{ error: "Invalid range parameter; expected JSON { min, max }" },
						{ status: 400 }
					);
				}

				const metric = METRIC_MAP[parsed.data.indicator];
				const gender = parsed.data.sex === "male" ? "boy" : "girl";

				const rows = EGYPTIAN_LMS_DATA[gender][metric].filter(
					p => p.x >= range.min && p.x <= range.max
				);

				return Response.json(
					{
						indicator: parsed.data.indicator,
						sex: parsed.data.sex,
						xAxis: "age",
						points: rows.map(p => ({
							x: p.x,
							sd3neg: p.sd3neg,
							sd2neg: p.sd2neg,
							sd1neg: p.sd1neg,
							sd0: p.sd0,
							sd1pos: p.sd1pos,
							sd2pos: p.sd2pos,
							sd3pos: p.sd3pos
						}))
					},
					{ headers: CACHE_HEADERS }
				);
			}
		}
	}
});
