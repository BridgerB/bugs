import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { count, ilike, or, getTableColumns, sql } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import { extractPage, extractSearch, paginationMeta } from '$lib/server/utils/pagination';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 50;

const buildWhere = (table: PgTable, search: string) => {
	if (!search) return undefined;
	const cols = Object.values(getTableColumns(table));
	const term = `%${search}%`;
	return or(...cols.map((c) => ilike(sql`${c}::text`, term)));
};

const tables = {
	organizations: schema.organizations,
	users: schema.users,
	customers: schema.customers,
	properties: schema.properties,
	services: schema.services,
	subscriptions: schema.subscriptions,
	products: schema.products,
	jobs: schema.jobs,
	jobProducts: schema.jobProducts,
	invoices: schema.invoices,
	payments: schema.payments,
	communications: schema.communications,
	devices: schema.devices,
	attachments: schema.attachments,
	pay: schema.pay
} as const;

type TableName = keyof typeof tables;

export const load: PageServerLoad = async ({ url }) => {
	const tableName = (url.searchParams.get('table') ?? 'customers') as TableName;
	const tableNames = Object.keys(tables);
	const search = extractSearch(url);

	if (!(tableName in tables)) {
		return {
			tableNames,
			tableName: 'customers',
			columns: [],
			rows: [],
			search,
			...paginationMeta(0, 1, PAGE_SIZE)
		};
	}

	const table = tables[tableName];
	const page = extractPage(url);
	const where = buildWhere(table, search);

	const [{ total }] = await db.select({ total: count() }).from(table).where(where);

	const rows = await db
		.select()
		.from(table)
		.where(where)
		.limit(PAGE_SIZE)
		.offset((page - 1) * PAGE_SIZE);

	const columns = rows.length > 0 ? Object.keys(rows[0]) : Object.keys(table);

	return {
		tableNames,
		tableName,
		columns,
		rows,
		search,
		...paginationMeta(total, page, PAGE_SIZE)
	};
};
