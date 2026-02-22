export const extractPage = (url: URL): number =>
	Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));

export const extractSearch = (url: URL): string => url.searchParams.get('search')?.trim() || '';

export const paginationMeta = (total: number, page: number, pageSize: number) => ({
	total,
	totalPages: Math.ceil(total / pageSize),
	currentPage: page,
	pageSize
});
