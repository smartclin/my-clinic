import { useMemo, useState } from "react";

export interface UseListTableStateOptions<T> {
	data?: T[];
	initialPageIndex?: number;
	initialPageSize?: number;
	initialSearch?: string;
	searchFn?: (item: T, query: string) => boolean;
}

export function useListTableState<T>(
	options: UseListTableStateOptions<T> = {}
) {
	const {
		data = [],
		initialPageIndex = 0,
		initialPageSize = 20,
		initialSearch = "",
		searchFn
	} = options;

	const [pageIndex, setPageIndex] = useState(initialPageIndex);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [searchValue, setSearchValue] = useState(initialSearch);
	const [filters, setFilters] = useState<Record<string, string>>({});

	const filteredData = useMemo(() => {
		let result = data;

		if (searchValue.trim() && searchFn) {
			result = result.filter(item => searchFn(item, searchValue.trim()));
		}

		return result;
	}, [data, searchValue, searchFn]);

	const total = filteredData.length;
	const pageCount = Math.max(1, Math.ceil(total / pageSize));

	const paginatedData = useMemo(() => {
		const start = pageIndex * pageSize;
		return filteredData.slice(start, start + pageSize);
	}, [filteredData, pageIndex, pageSize]);

	const setFilter = (key: string, value: string) => {
		setFilters(prev => ({ ...prev, [key]: value }));
		setPageIndex(0);
	};

	const clearFilters = () => {
		setFilters({});
		setSearchValue("");
		setPageIndex(0);
	};

	const onSearchChange = (value: string) => {
		setSearchValue(value);
		setPageIndex(0);
	};

	return {
		pageIndex,
		setPageIndex,
		pageSize,
		setPageSize,
		searchValue,
		setSearchValue: onSearchChange,
		filters,
		setFilter,
		clearFilters,
		hasFilters: Boolean(searchValue || Object.keys(filters).length > 0),
		total,
		pageCount,
		paginatedData,
		filteredData
	};
}
