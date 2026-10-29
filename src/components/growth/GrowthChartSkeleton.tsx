// src/components/growth/GrowthChartSkeleton.tsx
"use client";

export interface GrowthChartSkeletonProps {
	height?: number;
	className?: string;
}

export const GrowthChartSkeleton = ({
	height = 360,
	className
}: GrowthChartSkeletonProps) => (
	<div
		aria-busy='true'
		aria-live='polite'
		className={["growth-chart-skeleton", className].filter(Boolean).join(" ")}
		role='status'
		style={
			typeof height === "number"
				? ({ "--growth-chart-height": `${height}px` } as React.CSSProperties & {
						"--growth-chart-height": string;
					})
				: undefined
		}
	>
		<span className='sr-only'>Loading growth chart…</span>
		{`
        .growth-chart-skeleton {
          width: 100%;
          height: var(--growth-chart-height, 360px);
          border-radius: 8px;
          background: linear-gradient(90deg, var(--muted, #e5e7eb) 0%, var(--muted-foreground, #d1d5db) 50%, var(--muted, #e5e7eb) 100%);
          background-size: 200% 100%;
          animation: growth-skeleton-pulse 1.4s ease-in-out infinite;
        }

        @keyframes growth-skeleton-pulse {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}
	</div>
);
