// src/lib/shadcn/page-range.ts
export function pageRange(
	current: number,
	total: number,
	siblings = 1
): (number | "gap")[] {
	if (total <= 0) return [];
	if (total <= 5 + siblings * 2) {
		return Array.from({ length: total }, (_, i) => i + 1);
	}

	const leftSibling = Math.max(current - siblings, 1);
	const rightSibling = Math.min(current + siblings, total);

	const showLeftGap = leftSibling > 2;
	const showRightGap = rightSibling < total - 1;

	if (!showLeftGap && showRightGap) {
		const leftItemCount = 3 + 2 * siblings;
		const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
		return [...leftRange, "gap", total];
	}

	if (showLeftGap && !showRightGap) {
		const rightItemCount = 3 + 2 * siblings;
		const rightRange = Array.from(
			{ length: rightItemCount },
			(_, i) => total - rightItemCount + i + 1
		);
		return [1, "gap", ...rightRange];
	}

	const middleRange = Array.from(
		{ length: rightSibling - leftSibling + 1 },
		(_, i) => leftSibling + i
	);
	return [1, "gap", ...middleRange, "gap", total];
}
