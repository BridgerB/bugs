import { pgTable, serial, text, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'technician']);

export const jobStatusEnum = pgEnum('job_status', [
	'scheduled',
	'in_progress',
	'completed',
	'cancelled'
]);

export const organizations = pgTable('organizations', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	phone: text('phone'),
	email: text('email'),
	role: userRoleEnum('role').notNull().default('technician'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const customers = pgTable('customers', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	phone: text('phone'),
	email: text('email'),
	address: text('address'),
	city: text('city'),
	state: text('state'),
	zip: text('zip'),
	notes: text('notes'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

export const jobs = pgTable('jobs', {
	id: serial('id').primaryKey(),
	organizationId: integer('organization_id')
		.notNull()
		.references(() => organizations.id),
	customerId: integer('customer_id')
		.notNull()
		.references(() => customers.id),
	technicianId: integer('technician_id')
		.notNull()
		.references(() => users.id),
	status: jobStatusEnum('status').notNull().default('scheduled'),
	scheduledDate: timestamp('scheduled_date').notNull(),
	completedDate: timestamp('completed_date'),
	pestType: text('pest_type'),
	notes: text('notes'),
	createdAt: timestamp('created_at').notNull().defaultNow()
});
