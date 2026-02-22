<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	let { data } = $props();

	let searchInput = $derived(data.search);

	const nav = (path: string, opts?: Parameters<typeof goto>[1]) =>
		goto(resolve(path as Parameters<typeof resolve>[0]), opts);

	const onTableChange = (e: Event) => {
		const name = (e.target as HTMLSelectElement).value;
		searchInput = '';
		nav(`/data?table=${name}`);
	};

	const onSearchInput = (e: Event) => {
		const value = (e.target as HTMLInputElement).value;
		searchInput = value;
		const url = new URL(page.url);
		const trimmed = value.trim();
		if (trimmed) {
			url.searchParams.set('search', trimmed);
		} else {
			url.searchParams.delete('search');
		}
		url.searchParams.delete('page');
		nav(url.pathname + url.search, { keepFocus: true });
	};

	const clearSearch = () => {
		searchInput = '';
		const url = new URL(page.url);
		url.searchParams.delete('search');
		url.searchParams.delete('page');
		nav(url.pathname + url.search, { keepFocus: true });
	};

	const goToPage = (p: number) => {
		const url = new URL(page.url);
		if (p > 1) {
			url.searchParams.set('page', String(p));
		} else {
			url.searchParams.delete('page');
		}
		nav(url.pathname + url.search, { keepFocus: true });
	};

	const pageNumbers = $derived.by(() => {
		const { currentPage, totalPages } = data;
		const pages: (number | '...')[] = [];
		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
			return pages;
		}
		pages.push(1);
		if (currentPage > 3) pages.push('...');
		const start = Math.max(2, currentPage - 1);
		const end = Math.min(totalPages - 1, currentPage + 1);
		for (let i = start; i <= end; i++) pages.push(i);
		if (currentPage < totalPages - 2) pages.push('...');
		pages.push(totalPages);
		return pages;
	});
</script>

<header class="page-header">
	<h1 class="page-title">Data</h1>
	<div class="page-toolbar">
		<label class="toolbar-field">
			<span class="toolbar-label">Table</span>
			<select class="table-select" value={data.tableName} onchange={onTableChange}>
				{#each data.tableNames as name (name)}
					<option value={name}>{name}</option>
				{/each}
			</select>
		</label>
		<label class="toolbar-field">
			<span class="toolbar-label">Search</span>
			<input
				class="search-input"
				type="search"
				placeholder="Search..."
				value={searchInput}
				oninput={onSearchInput}
			/>
		</label>
		{#if searchInput}
			<button class="search-clear" onclick={clearSearch}>Clear</button>
		{/if}
		<small class="row-count">
			{data.total} rows
			{#if data.search}<span class="row-count-filtered">(filtered)</span>{/if}
		</small>
	</div>
</header>

{#if data.rows.length === 0}
	<p class="empty-state">No rows found.</p>
{:else}
	<div class="table-wrap">
		<table class="data-table">
			<thead>
				<tr>
					{#each data.columns as col (col)}
						<th>{col}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each data.rows as row, i (i)}
					<tr>
						{#each data.columns as col (col)}
							<td>{(row as Record<string, unknown>)[col] ?? ''}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<nav aria-label="Pagination" class="pagination">
		<button
			class="pagination-btn pagination-first"
			disabled={data.currentPage <= 1}
			onclick={() => goToPage(1)}>&laquo;</button
		>
		<button
			class="pagination-btn pagination-prev"
			disabled={data.currentPage <= 1}
			onclick={() => goToPage(data.currentPage - 1)}>&lsaquo;</button
		>
		{#each pageNumbers as p (p)}
			{#if p === '...'}
				<span class="pagination-ellipsis">&hellip;</span>
			{:else}
				<button
					class="pagination-btn pagination-page"
					aria-current={p === data.currentPage ? 'page' : undefined}
					onclick={() => goToPage(p)}
				>
					{p}
				</button>
			{/if}
		{/each}
		<button
			class="pagination-btn pagination-next"
			disabled={data.currentPage >= data.totalPages}
			onclick={() => goToPage(data.currentPage + 1)}>&rsaquo;</button
		>
		<button
			class="pagination-btn pagination-last"
			disabled={data.currentPage >= data.totalPages}
			onclick={() => goToPage(data.totalPages)}>&raquo;</button
		>
	</nav>
{/if}

<style>
	.page-header {
		margin-bottom: 1rem;
	}

	.page-title {
		margin: 0 0 0.5rem;
	}

	.table-wrap {
		overflow-x: auto;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
	}

	.data-table th,
	.data-table td {
		padding: 0.375rem 0.75rem;
		text-align: left;
		border-bottom: 1px solid #ddd;
		white-space: nowrap;
	}

	.data-table td {
		max-width: 300px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.pagination {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.25rem;
		margin-top: 1rem;
	}

	.pagination-btn[aria-current='page'] {
		font-weight: bold;
	}
</style>
